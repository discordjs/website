<template>
  <div class="class-prop class-item" :id="`doc-for-${prop.name}`">
    <source-button :meta="prop.meta" :docs="docs" />

    <h3><router-link :to="{ name: 'docs-class', query: { scrollTo } }">.{{ prop.name }}</router-link></h3>
    <span v-if="prop.scope === 'static'" class="class-item-badge" title="This property is on the class constructor function, not instances.">Static</span>
    <span v-if="prop.readonly" class="class-item-badge" title="This property cannot be modified.">Read-only</span>
    <span v-if="prop.access === 'private'" class="class-item-badge" title="This property is private, and may not exist as-is in future versions.">Private</span>

    <div class="class-item-details">
      <p v-html="description"></p>
      <param-table :params="prop.props" :docs="docs" v-if="prop.props && prop.props.length > 0" />
      <div class="prop-type">
        Type:
        <types v-for="type in prop.type" :names="type" :nullable="prop.nullable" :docs="docs" />
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
        return Vue.filter('marked')(this.prop.description);
      },

      scrollTo() {
        return `${this.prop.scope === 'static' ? 's-' : ''}${this.prop.name}`;
      },
    },
  };
</script>

<style lang="scss">
  @import '../../../styles/theming';

  .class-prop p {
    margin: 0 0 8px 0;
  }

  .prop-type {
    color: lighten($color-content-text, 35%);
    font-weight: bold;
  }
</style>
