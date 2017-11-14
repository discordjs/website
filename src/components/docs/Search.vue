<template>
  <div id="docs-search" class="docs-page">
    <em id="show-scores" :class="`fa fa-bar-chart ${!showScores ? 'disabled' : ''}`" :title="showScores ? 'Hide scores' : 'Show scores'" @click="toggleScores"></em>

    <h1>Search</h1>
    <input v-model.trim="search" type="search" />

    <div id="toggles">
      <label><input type="checkbox" v-model="toggles['classes']" /> Classes</label>
      <label><input type="checkbox" v-model="toggles['props']" /> Properties</label>
      <label><input type="checkbox" v-model="toggles['methods']" /> Methods</label>
      <label><input type="checkbox" v-model="toggles['events']" /> Events</label>
      <label><input type="checkbox" v-model="toggles['typedefs']" /> Typedefs</label>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="search && search.length > 2">
        <h2 v-if="search && search.length > 2">Results for "{{ search }}"</h2>

        <transition name="fade" mode="out-in">
          <transition-group name="animated-list" tag="ul" v-if="results.length > 0" key="results">
            <li v-for="result in results" :key="`${result.key || result.name}`" class="animated-list-item">
              <span v-if="showScores" class="score">{{ Math.round(result.score * 100) }}%</span>
              <router-link :to="result.route">
                <span class="badge" :title="result.badge">{{ result.badge[0] }}</span>
                {{ result.name }}{{ result.badge === 'Method' ? '()' : '' }}
              </router-link>
            </li>
          </transition-group>

          <p v-else key="empty">No results.</p>
        </transition>
      </div>

      <p v-else key="short">Your search query must be at least three characters.</p>
    </transition>
  </div>
</template>

<script>
  import levenshtein from 'js-levenshtein';
  import { sort } from 'timsort';

  export default {
    name: 'docs-search',
    props: ['docs', 'showPrivate'],

    data() {
      return {
        search: this.$route.query.q,
        toggles: { classes: true, props: true, methods: true, events: true, typedefs: true },
        showScores: false,
      };
    },

    computed: {
      results() {
        const q = this.search.toLowerCase();
        const results = [];

        for (const clarse of this.docs.classes) {
          if (!this.showPrivate && clarse.access === 'private') continue;

          if (this.toggles.classes) {
            const cScore = searchScore(q, clarse.name.toLowerCase(), null, 1) * 1.05;
            if (cScore >= scoreThreshold) {
              results.push({
                score: cScore,
                name: clarse.name,
                route: { name: 'docs-class', params: { class: clarse.name } },
                badge: 'Class',
              });
            }
          }

          for (const [group, groupName] of [['props', 'Property'], ['methods', 'Method'], ['events', 'Event']]) {
            if (!clarse[group] || !this.toggles[group]) continue;
            for (const item of clarse[group]) {
              if (!this.showPrivate && item.access === 'private') continue;
              const name = fullName(item, clarse, group);
              const score = searchScore(q, item.name.toLowerCase(), cScore <= 0.9 ? name.toLowerCase() : null);
              if (score < scoreThreshold) continue;
              results.push({
                score,
                name,
                route: { name: 'docs-class', params: { class: clarse.name }, query: { scrollTo: this.scopedName(item) } },
                badge: groupName,
                key: group === 'events' ? `e-${name}` : null,
              });
            }
          }
        }

        if (this.toggles.typedefs) {
          for (const typedef of this.docs.typedefs) {
            if (!this.showPrivate && typedef.access === 'private') continue;
            const tScore = searchScore(q, typedef.name.toLowerCase(), null, 1) * 1.05;
            if (tScore < scoreThreshold) continue;
            results.push({
              score: tScore,
              name: typedef.name,
              route: { name: 'docs-typedef', params: { typedef: typedef.name } },
              badge: 'Typedef',
            });
          }
        }

        sort(results, (a, b) => b.score - a.score);
        return results;
      },
    },

    methods: {
      toggleScores() {
        this.showScores = !this.showScores;
      },

      scopedName(item) {
        return `${item.scope === 'static' ? 's-' : ''}${item.name}`;
      },
    },

    watch: {
      $route(to) {
        this.search = to.query.q;
      },

      search(q) {
        if (this.$route.query.q === q) return;
        if (this.$route.query.q) this.$router.replace({ name: 'docs-search', query: { q } });
        else this.$router.push({ name: 'docs-search', query: { q } });
      },
    },
  };

  const scoreThreshold = 0.45;

  function searchScore(q, shortName, longName, identicalWeight) {
    if (q === shortName || q === longName) return 1 + (identicalWeight === undefined ? 0.5 : identicalWeight);
    const name = shortName || longName;

    let longer = q, shorter = name;
    if (q.length < name.length) {
      longer = name;
      shorter = q;
    }

    const longerLength = longer.length;
    if (longerLength === 0) return 1;
    const score = (longerLength - levenshtein(longer, shorter)) / longerLength
    return shortName.includes(q) ? Math.min(score, scoreThreshold) : score;
  }

  function fullName(child, parent) {
    return `${parent.name + (child.scope === 'static' ? '.' : '#')}${child.name}`;
  }
</script>

<style lang="scss">
  @import '../../styles/theming';
  @import '../../styles/mq';

  #docs-search {
    padding: 16px 32px;

    input[type="search"] {
      margin: 4px 2px;
      width: 16rem;
      max-width: 100%;

      @include mq($from: tablet) {
        display: none;
      }
    }

    #show-scores {
      display: block;
      float: right;
      cursor: pointer;
      color: $color-primary;
      transition: color 0.3s;

      &.disabled {
        color: $color-content-text;

        &:hover {
          color: lighten($color-content-text, 50%);
        }
      }

      &:hover {
        color: lighten($color-primary, 20%);
      }
    }

    #toggles {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      margin-top: 4px;

      label {
        flex: 1;
        margin: 4px;
      }

      input {
        position: relative;
        top: 2px;
        margin-right: 2px;
      }

      @include mq($until: desktop) {
        flex-direction: column;
      }
    }

    ul {
      padding-left: 24px;
      list-style: none;
    }

    li {
      margin-bottom: 4px;
    }

    .badge {
      display: inline-block;
      width: 0.8rem;
      margin-left: 0;
      margin-right: 8px;
      padding: 3px 4px;
      text-align: center;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }

    .score {
      display: inline-block;
      position: relative;
      right: 1.7rem;
      width: 0;
      margin: 0;
      font-size: 0.7rem;
      overflow: visible;
      color: lighten($color-content-text, 40%);
    }

    a {
      display: inline-block;
      height: 100%;

      &:hover .badge {
        background: lighten($color-primary, 20%);
      }
    }
  }
</style>
