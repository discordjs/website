<template>
  <span class="docs-type">
    {{ nullable ? '?' : ''}}{{ variable ? '...' : '' }}<!--
    --><type-link v-for="type in names" :type="type" :docs="docs" :key="typeKey(type)" />
  </span>
</template>

<script>
import TypeLink from './TypeLink.vue';
import { typeKey } from '../../util';

export default {
  name: 'types',
  props: ['names', 'variable', 'nullable', 'docs'],
  components: {
    TypeLink,
  },

  methods: {
    typeKey,
  },
};
</script>

<style lang="scss">
  @import '../../styles/theming';

  .docs-type {
    font-family: $font-monospace;
    font-weight: bold;
    font-size: 0.875rem;
  }
</style>
