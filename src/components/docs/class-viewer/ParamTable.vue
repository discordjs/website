<template>
  <div class="param-table-wrapper">
    <table class="param-table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Type</th>
          <th v-if="hasOptional">Optional</th>
          <th v-if="hasOptional">Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="param in params" :key="param.name">
          <td>{{ param.name }}</td>
          <td><types v-for="type in param.type" :names="type" :variable="param.variable" :nullable="param.nullable" :docs="docs" :key="typeKey(type)" /></td>
          <td v-if="hasOptional">
            <em class="fa fa-check" v-if="param.optional"></em>
          </td>
          <td v-if="hasOptional">
            <em v-if="param.optional && typeof param.default === 'undefined'">none</em>
            <span v-else v-html="paramDefault(param)"></span>
          </td>
          <td v-html="paramDescription(param)"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vue from 'vue';
import Types from '../Types.vue';
import { convertLinks, typeKey } from '../../../util';

export default {
  name: 'param-table',
  props: ['params', 'docs'],
  components: {
    Types,
  },

  computed: {
    hasOptional() {
      return this.params.some(p => p.optional);
    },
  },

  methods: {
    typeKey,

    paramDescription(param) {
      return Vue.filter('marked')(convertLinks(param.description, this.docs, this.$router, this.$route));
    },

    paramDefault(param) {
      return param.optional ? `<code>${param.default}</code>` : '';
    },
  },
};
</script>

<style lang="scss">
  @import '../../../styles/theming';
  @import '../../../styles/mq';

  .param-table {
    border-collapse: collapse;
    border: 1px solid darken($color-inactive-border, 5%);

    thead {
      margin: 0;
    }

    th {
      background: $color-primary;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
      padding: 16px;
    }

    th, td {
      padding: 16px;
      text-align: center;
    }

    tr {
      background: darken($color-content-bg, 2%);

      &:nth-child(even) {
        background: darken($color-content-bg, 4%);
      }
    }

    @include mq($until: desktop) {
      width: 100%;
      max-width: 100%;
    }
  }

  .param-table-wrapper {
    overflow: auto;
  }

  #app.dark .param-table {
    border-color: lighten($color-inactive-border-dark, 5%);

    tr {
      background: lighten($color-content-bg-dark, 4%);

      &:nth-child(even) {
        background: lighten($color-content-bg-dark, 6%);
      }
    }
  }
</style>
