<template>
  <div class="class-event class-item" :id="`doc-for-e-${event.name}`">
    <source-button :meta="event.meta" :docs="docs" />

    <h3><router-link :to="{ name: 'docs-class', query: { scrollTo: `e-${event.name}` } }">{{ event.name }}</router-link></h3>
    <span v-if="event.deprecated" class="badge warn" title="This event is deprecated, and may be removed in a future version.">Deprecated</span>

    <div class="class-item-details">
      <p v-html="description"></p>
      <param-table :params="event.params" :docs="docs" v-if="event.params && event.params.length > 0" />
      <see v-if="event.see" :see="event.see" :docs="docs" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ParamTable from './ParamTable.vue';
import SourceButton from '../SourceButton.vue';
import See from '../See';
import { convertLinks } from '../../../util';

export default {
  name: 'class-event',
  props: ['event', 'docs'],
  components: {
    ParamTable,
    SourceButton,
    See,
  },

  computed: {
    description() {
      return Vue.filter('marked')(convertLinks(this.event.description, this.docs, this.$router, this.$route));
    },
  },
};
</script>

<style lang="scss">
  @import '../../../styles/theming';

  .class-event {
    p:not(.docs-see) {
      margin: 0;
    }

    .param-table {
      margin-top: 8px;
    }
  }
</style>
