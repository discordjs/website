<template>
  <div id="docs-navbar">
    <container>
      View docs for

      <select v-model="sourceChoice">
        <option v-for="source in sources" :value="source.id" :key="source.id">{{ source.name }}</option>
      </select>

      <transition name="fade" mode="out-in" @enter="updateTagChoice">
        <select v-if="tags" v-model="tagChoice" :key="source.id">
          <option v-for="tag in tags" :value="tag" :key="tag">{{ tag }}</option>
        </select>
        <loading v-else />
      </transition>

      <input v-model.lazy.trim="search" v-debounce="200" type="search" placeholder="Search" @keypress.enter="goToSearch" />
      <router-link :to="{ name: 'docs-search' }"><em class="fa fa-search"></em></router-link>
    </container>
  </div>
</template>

<script>
import debounce from '../../debounce';
import { SHITS } from '../../util';

export default {
  name: 'docs-navbar',
  props: ['sources', 'source'],
  directives: {
    debounce,
  },

  data() {
    return {
      sourceChoice: this.source.id,
      tagChoice: null,
      tags: null,
      search: this.$route.query.q,
    };
  },

  methods: {
    loadTags() {
      this.tags = this.source.tags;
      if (!this.tags) {
        const startSource = this.source;
        this.source.fetchTags().then(tags => {
          if (this.source.id === startSource.id) this.tags = tags;
        });
      }
    },

    updateTagChoice() {
      if (this.tags) this.tagChoice = this.$route.params.tag || this.source.recentTag || this.source.defaultTag;
    },

    goToSearch() {
      if (this.$route.name !== 'docs-search') this.$router.push({ name: 'docs-search', query: { q: this.search } });
    },
  },

  watch: {
    sourceChoice(src) {
      if (this.$route.params.source !== src) this.$router.push({ name: 'docs-source', params: { source: src } });
    },

    tagChoice(tag) {
      if (tag && this.$route.params.tag !== tag) {
        SHITS.switching = true;
        this.$router.push({ name: this.$route.name, params: { ...this.$route.params, tag }, query: this.$route.query });
      }
    },

    source(source) {
      this.sourceChoice = source.id;
      this.tagChoice = null;
      this.loadTags();
    },

    search(q) {
      if (this.$route.query.q) this.$router.replace({ name: 'docs-search', query: { q } });
      else this.$router.push({ name: 'docs-search', query: { q } });
    },

    $route(to) {
      if (this.tagChoice && to.params.tag && this.tagChoice !== to.params.tag) this.tagChoice = to.params.tag;
    },
  },

  created() {
    this.loadTags();
  },

  mounted() {
    this.updateTagChoice();
  },
};
</script>

<style lang="scss">
  @import '../../styles/theming';
  @import '../../styles/mq';

  $bg: lighten($color-navbar-bg, 6.5%);

  #docs-navbar {
    padding: 16px;
    background: lighten($color-navbar-bg, 6.5%);
    color: #aaa;
    font-size: 0.9rem;

    select, input {
      display: inline-block;
      background: lighten($color-navbar-bg, 6.5%);
      color: white;
      font-family: $font-regular;
      font-size: 0.85rem;
      border: 1px solid #aaa;
    }

    select {
      margin-left: 6px;
    }

    input {
      display: block;
      float: right;
      padding: 3px 2px;
      border: none;
      border-bottom: 1px solid #aaa;
      transition: border-color 0.3s;

      &:focus {
        border-color: $color-primary;
        outline: none;
      }

      @include mq($until: tablet) {
        display: none;
      }
    }

    a {
      float: right;
      color: white;

      @include mq($from: tablet) {
        display: none;
      }
    }

    .sk-folding-cube {
      position: relative;
      top: 3px;
      left: 10px;
      width: 16px;
      height: 16px;
    }
  }
</style>
