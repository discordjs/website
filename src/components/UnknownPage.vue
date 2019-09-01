<template>
  <div>
    <h1>Unknown {{ type || 'page' }}</h1>
    <p>This page doesn't actually exist. Oh no!</p>
    <p>Instead, please accept this exceptionally awesome piece of artwork:</p>
    <p><awesome :light="darkMode" /></p>
  </div>
</template>

<script>
import Awesome from './Awesome.vue';

export default {
  name: 'unknown-page',
  props: ['type', 'darkMode'],
  components: { Awesome },
};
</script>

<style>
  #awesome {
    width: 100%;
    max-width: 476px;
  }
</style>
