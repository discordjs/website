<template>
  <transition-group name="animated-list" tag="ul" class="results-list">
    <li v-for="result in results" :key="result.item.key || result.item.fullName || result.item.name" class="animated-list-item">
      <span v-if="showScores" class="score">{{ Math.round((1 - result.score) * 100) }}%</span>
      <router-link :to="result.item.route">
        <span class="badge" :title="result.item.type">{{ result.item.type[0] }}</span>
        <span v-html="highlightName(result.item.fullName || result.item.name)"></span>{{ result.item.type === 'Method' ? '()' : '' }}
      </router-link>
    </li>
  </transition-group>
</template>

<script>
export default {
  props: ['results', 'showScores', 'searchTerm'],

  methods: {
    highlightName(name) {
      return name.replace(this.searchRegex, match => `<strong>${match}</strong>`);
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
    }
  }

  #app.dark .results-list .score {
    color: darken($color-content-text-dark, 40%);
  }
</style>
