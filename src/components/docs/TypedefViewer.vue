<template>
  <div v-if="typedef" id="typedef-viewer" class="docs-page">
    <source-button :meta="typedef.meta" :docs="docs" />

    <h1>{{ typedef.name }}</h1>
    <span v-if="typedef.deprecated" class="badge warn" title="This typedef is deprecated, and may be removed in a future version.">Deprecated</span>
    <p v-if="typedef.description" v-html="description" class="typedef-desc"></p>
    <see v-if="typedef.see" :see="typedef.see" :docs="docs" />

    <h2>Types</h2>
    <ul id="typedef-types">
      <li v-for="type in typedef.type" :key="typeKey(type)"><types :names="type" :docs="docs" /></li>
    </ul>

    <div v-if="typedef.props && typedef.props.length > 0" id="typedef-props">
      <h2>Properties</h2>
      <param-table :params="typedef.props" :docs="docs" />
    </div>

    <div v-if="typedef.params && typedef.params.length > 0" id="typedef-params">
      <h2>Parameters</h2>
      <param-table :params="typedef.params" :docs="docs" />
    </div>

    <div v-if="typedef.returns" id="typedef-returns">
      <h2>Returns</h2>
      <p id="typedef-returns-types">
        <types v-for="rtrn in typedef.returns.types || typedef.returns" :names="rtrn" :variable="typedef.returns.variable" :nullable="typedef.returns.nullable" :docs="docs" :key="typeKey(rtrn)" />
      </p>
      <p v-if="typedef.returns.description" v-html="returnsDescription"></p>
    </div>
  </div>
  <unknown-page v-else class="docs-page" :darkMode="darkMode" />
</template>

<script>
import Vue from 'vue';
import { hljs, convertLinks, typeKey } from '../../util';
import Types from './Types.vue';
import ParamTable from './class-viewer/ParamTable.vue';
import SourceButton from './SourceButton.vue';
import See from './See.vue';

export default {
  name: 'typedef-viewer',
  props: ['docs', 'darkMode'],
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
      return Vue.filter('marked')(convertLinks(this.typedef.description, this.docs, this.$router, this.$route));
    },

    returnsDescription() {
      const returns = this.typedef.returns;
      if (returns) return Vue.filter('marked')(convertLinks(returns.description, this.docs, this.$router, this.$route));
      return '';
    },
  },

  methods: {
    typeKey,
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
    h1 {
      display: inline-block;
    }

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

    code {
      font-family: $font-monospace;
      font-size: 0.8rem;
    }

    :not(pre) > code {
      background: darken($color-content-bg, 3.5%);
      border-radius: 2px;
    }
  }

  #app.dark #typedef-viewer :not(pre):not(.info):not(.warn) > code {
    background: lighten($color-content-bg-dark, 3.5%);
  }
</style>
