<template>
  <span class="docs-type"><type-link v-for="type in names" :type="type" :docs="docs" /></span>
</template>

<script>
  import TypeLink from './TypeLink.vue';

  export default {
    name: 'types',
    props: ['names', 'docs'],
    components: {
      TypeLink,
    },
  };
</script>

<style lang="scss">
  @import '../../styles/theming';

  .docs-type {
    font-family: $font-monospace;
    font-weight: bold;
    font-size: 14px;
  }
</style>
