<template>
  <div class="class-prop class-item" :id="`doc-for-${scrollTo}`">
    <source-button :meta="prop.meta" :docs="docs" />

    <h3><router-link :to="{ name: 'docs-class', query: { scrollTo } }">.{{ prop.name }}</router-link></h3>
    <span v-if="prop.scope === 'static'" class="badge" title="This property is on the class constructor function, not instances.">Static</span>
    <span v-if="prop.readonly" class="badge" title="This property cannot be modified.">Read-only</span>
    <span v-if="prop.deprecated" class="badge warn" title="This property is deprecated, and may be removed in a future version.">Deprecated</span>
    <span v-if="prop.access === 'private'" class="badge warn" title="This property is private, and may change or be removed at any time.">Private</span>

    <div class="class-item-details">
      <p v-html="description"></p>
      <param-table :params="prop.props" :docs="docs" v-if="prop.props && prop.props.length > 0" />
      <div class="prop-type">
        Type:
        <types v-for="type in prop.type" :names="type" :nullable="prop.nullable" :docs="docs" :key="typeKey(type)" />
      </div>
      <div v-if="prop.default" class="prop-default">
        Default: <code>{{ prop.default }}</code>
      </div>
      <see v-if="prop.see" :see="prop.see" :docs="docs" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Types from '../Types.vue';
import ParamTable from './ParamTable.vue';
import SourceButton from '../SourceButton.vue';
import See from '../See.vue';
import { convertLinks, typeKey } from '../../../util';

export default {
  name: 'class-property',
  props: ['prop', 'docs'],
  components: {
    Types,
    ParamTable,
    SourceButton,
    See,
  },

  computed: {
    description() {
      return Vue.filter('marked')(convertLinks(this.prop.description, this.docs, this.$router, this.$route));
    },

    scrollTo() {
      return `${this.prop.scope === 'static' ? 's-' : ''}${this.prop.name}`;
    },
  },

  methods: {
    typeKey,
  },
};
</script>

<style lang="scss">
  @import '../../../styles/theming';

  .class-prop {
    p {
      margin: 0 0 8px 0;
    }

    .param-table-wrapper {
      margin-bottom: 8px;
    }
  }

  .prop-type, .prop-default {
    color: lighten($color-content-text, 35%);
    font-weight: bold;
  }

  .prop-default {
    margin-top: 8px;
  }

  #app.dark .prop-type, .prop-default {
    color: darken($color-content-text-dark, 35%);
  }
</style>
