<template>
  <div class="class-event class-item" :id="`doc-for-${event.name}`">
    <source-button :meta="event.meta" :docs="docs" />

    <h3><router-link :to="{ name: 'docs-class', query: { scrollTo: event.name } }">{{ event.name }}</router-link></h3>

    <div class="class-item-details">
      <p v-html="description"></p>
      <param-table :params="event.params" :docs="docs" v-if="event.params && event.params.length > 0" />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import ParamTable from './ParamTable.vue';
  import SourceButton from '../SourceButton.vue';

  export default {
    name: 'class-event',
    props: ['event', 'docs'],
    components: {
      ParamTable,
      SourceButton,
    },

    computed: {
      description() {
        return Vue.filter('marked')(this.event.description);
      },
    },
  };
</script>

<style lang="scss">
  @import '../../../styles/theming';

  .class-event {
    p {
      margin: 0;
    }

    .param-table {
      margin-top: 8px;
    }
  }
</style>
