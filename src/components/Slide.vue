<template>
  <div class="slide">
    <container>
      <slot />
    </container>
  </div>
</template>

<script>
export default { name: 'slide' };
</script>

<style>
  .slide {
    padding: 16px;
  }
</style>
