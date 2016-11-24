<template>
  <div id="typedef-viewer" class="docs-page">
    <source-button :meta="typedef.meta" :docs="docs" />
    <h1>{{ typedef.name }}</h1>
    <p class="typedef-desc" v-html="description" v-if="typedef.description"></p>
    <see v-if="typedef.see" :see="typedef.see" :docs="docs" />

    <h2>Types</h2>
    <ul id="typedef-types">
      <li v-for="type in typedef.type.types"><types :names="type" :docs="docs" /></li>
    </ul>

    <div id="typedef-params" v-if="typedef.props && typedef.props.length > 0">
      <h2>Properties</h2>
      <param-table :params="typedef.props" :docs="docs" />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { hljs } from '../../util';
  import Types from './Types.vue';
  import ParamTable from './class-viewer/ParamTable.vue';
  import SourceButton from './SourceButton.vue';
  import See from './See.vue';

  export default {
    name: 'typedef-viewer',
    props: ['docs'],
    components: {
      Types,
      ParamTable,
      SourceButton,
      See,
    },

    data() {
      return {
        typedef: this.docs.typedefs.find(t => t.name === this.$route.params.typedef),
      };
    },

    computed: {
      description() {
        return Vue.filter('marked')(this.typedef.description);
      },
    },

    mounted() {
      this.$nextTick(() => {
        for (const el of this.$el.querySelectorAll('pre code')) hljs(el);
      });
    },
  };
</script>

<style lang="scss">
  @import '../../styles/theming';

  #typedef-viewer {
    h2 {
      font-size: 1.3rem;
      margin-top: 40px;
    }

    #typedef-types {
      font-family: $font-monospace;
    }

    .param-table-wrapper {
      border: 0;
    }
  }
</style>
