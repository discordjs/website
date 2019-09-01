<template>
  <slide id="unknown-route">
    <unknown-page type="route" :darkMode="darkMode" />
  </slide>
</template>

<script>
export default {
  name: 'unknown-route',
  props: ['darkMode'],
};
</script>

<style lang="scss">
  @import '../../styles/theming';

  #unknown-route {
    background: $color-content-bg;
  }

  #app.dark #unknown-route {
    background: $color-content-bg-dark;
    color: $color-content-text-dark;
  }
</style>
