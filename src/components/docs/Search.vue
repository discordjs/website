<template>
  <div id="docs-search" class="docs-page">
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
              <router-link :to="result.route">
                <span class="badge">{{ result.badge }}</span>
                {{ result.name }}
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
      };
    },

    computed: {
      results() {
        const q = this.search.toLowerCase();
        const results = [];

        for (const clarse of this.docs.classes) {
          if (!this.showPrivate && clarse.access === 'private') continue;

          if (this.toggles.classes) {
            const clarseScore = score(q, clarse.name.toLowerCase(), 1);
            if (clarseScore >= scoreThreshold) {
              results.push({
                score: clarseScore * 1.1,
                name: clarse.name,
                route: { name: 'docs-class', params: { class: clarse.name } },
                badge: 'C',
              });
            }
          }

          for (const group of ['props', 'methods', 'events']) {
            if (!clarse[group] || !this.toggles[group]) continue;
            for (const item of clarse[group]) {
              if (!this.showPrivate && item.access === 'private') continue;
              const theScore = score(q, item.name.toLowerCase());
              if (theScore < scoreThreshold) continue;
              const name = fullName(item, clarse, group);
              results.push({
                score: theScore,
                name,
                route: { name: 'docs-class', params: { class: clarse.name }, query: { scrollTo: this.scopedName(item) } },
                badge: group[0].toUpperCase(),
                key: group === 'events' ? `e-${name}` : null,
              });
            }
          }
        }

        if (this.toggles.typedefs) {
          for (const typedef of this.docs.typedefs) {
            if (!this.showPrivate && typedef.access === 'private') continue;
            const typedefScore = score(q, typedef.name.toLowerCase(), 1);
            if (typedefScore < scoreThreshold) continue;
            results.push({
              score: typedefScore * 1.1,
              name: typedef.name,
              route: { name: 'docs-typedef', params: { typedef: typedef.name } },
              badge: 'T',
            });
          }
        }

        sort(results, (a, b) => b.score - a.score);
        console.log(results);
        return results;
      },
    },

    methods: {
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

  const scoreThreshold = 0.5;

  function score(s1, s2, identicalWeight) {
    let longer = s1, shorter = s2;
    if (longer === shorter) return 1 + (identicalWeight === undefined ? 0.5 : identicalWeight);
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) return 1;
    return (longerLength - levenshtein(longer, shorter)) / longerLength;
  }

  function fullName(child, parent, group) {
    return `${parent.name + (child.scope === 'static' ? '.' : '#')}${child.name}${group === 'methods' ? '()' : ''}`;
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

    #toggles {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      margin-top: 4px;

      label {
        flex: 1;
        margin: 4px;
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

    a {
      display: inline-block;
      height: 100%;

      &:hover .badge {
        background: lighten($color-primary, 20%);
      }
    }
  }
</style>
