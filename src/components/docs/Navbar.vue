<template>
  <div id="docs-navbar">
    <container>
      View docs for

      <select v-model="sourceChoice">
        <option v-for="source in sources" :value="source.id">{{ source.name }}</option>
      </select>

      <select v-model="tagChoice" v-if="tags">
        <option v-for="tag in tags" :value="tag">{{ tag }}</option>
      </select>
      <loading v-else />

      <input v-model.trim="search" type="search" placeholder="Search" />
      <router-link :to="{ name: 'docs-search' }"><em class="fa fa-search"></em></router-link>
    </container>
  </div>
</template>

<script>
  export default {
    name: 'docs-navbar',
    props: ['sources', 'source'],

    data() {
      return {
        sourceChoice: this.source.id,
        tagChoice: this.$route.params.tag || this.source.defaultTag,
        tags: null,
        search: this.$route.query.q,
      };
    },

    methods: {
      loadTags() {
        if (this.source.tags) {
          this.tags = this.source.tags;
        } else {
          const startSource = this.source;
          this.source.fetchTags().then(tags => {
            if (this.source.id === startSource.id) this.tags = tags;
          });
        }
      },
    },

    watch: {
      sourceChoice(val) {
        this.$router.push({ name: 'docs-source', params: { source: val } });
      },

      tagChoice(val) {
        this.$router.push({ name: 'docs-tag', params: { source: this.sourceChoice, tag: val } });
      },

      source() {
        this.loadTags();
        this.tagChoice = this.source.defaultTag;
      },

      search(q) {
        if (this.$route.query.q) this.$router.replace({ name: 'docs-search', query: { q } });
        else this.$router.push({ name: 'docs-search', query: { q } });
      },
    },

    created() {
      this.loadTags();
    },
  };
</script>

<style lang="scss">
  @import '../../styles/theming';
  @import '../../styles/mq';

  $input-border: ;
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
      font-size: 0.85rem;
      border: 1px solid #aaa;
    }

    select {
      margin-left: 6px;
    }

    input {
      float: right;
      padding: 2px;

      @include mq($until: desktop) {
        display: none;
      }
    }

    a {
      float: right;
      color: white;
    }

    @include mq($from: desktop) {
      a {
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
