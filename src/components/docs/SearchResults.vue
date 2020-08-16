<template>
  <transition-group name="animated-list" tag="ul" class="results-list">
    <li v-for="result in results" :key="result.item.key || result.item.fullName || result.item.name" class="animated-list-item">
      <span v-if="showScores" class="score">{{ Math.round((1 - result.score) * 100) }}%</span>
      <router-link :to="result.item.route">
        <span class="badge" :class="typeClass(result.item.type)" :title="result.item.type">{{ result.item.type[0] }}</span>
        <span v-html="highlightName(result)"></span>{{ result.item.type === 'Method' ? '()' : '' }}
      </router-link>
    </li>
  </transition-group>
</template>

<script>
export default {
  props: ['results', 'showScores', 'searchTerm'],

  methods: {
    highlightName(result) {
      // Get the match for the fullName
      const match = result.matches.find(m => m.key === 'fullName');
      if (!match) return result.item.fullName || result.item.name;

      // Highlight all matches
      let name = match.value;
      for (let i = match.indices.length - 1; i >= 0; i--) {
        const matchStr = name.slice(match.indices[i][0], match.indices[i][1] + 1);
        const start = name.slice(0, match.indices[i][0]);
        const end = name.slice(match.indices[i][1] + 1);
        const exact = matchStr.toLowerCase() === this.searchTerm.toLowerCase();
        name = `${start}${exact ? '<strong>' : ''}<em>${matchStr}</em>${exact ? '</strong>' : ''}${end}`;
      }

      return name;
    },

    typeClass(type) {
      if (type === 'Property') return 'secondary';
      if (type === 'Method') return 'tertiary';
      if (type === 'Event') return 'quaternary';
      if (type === 'Typedef') return 'quinary';
      return '';
    },
  },

  computed: {
    searchRegex() {
      return new RegExp(this.searchTerm, 'ig');
    },
  },
};
</script>

<style lang="scss">
  @import '../../styles/theming';

  .results-list {
    padding-left: 24px;
    list-style: none;

    li {
      margin-bottom: 4px;

      .badge {
        display: inline-block;
        width: 0.8rem;
        margin-left: 0;
        margin-right: 8px;
        padding: 3px 4px;
        text-align: center;
        font-size: 0.9rem;
        opacity: 1;
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

      em {
        font-style: normal;
        text-decoration: underline;
      }
    }
  }

  #app.dark .results-list .score {
    color: darken($color-content-text-dark, 40%);
  }
</style>
