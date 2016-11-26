<template>
  <div>
    <h1>Unknown {{ type || 'page' }}</h1>
    <p>This page doesn't actually exist. Oh no!</p>
    <p>Instead, please accept this exceptionally awesome piece of artwork:</p>
    <p><img src="../assets/awesome.png" alt="exceptionally awesome artwork goes here" id="awesome" /></p>
  </div>
</template>

<script>
  export default {
    name: 'unknown-page',
    props: ['type'],
  };
</script>

<style>
  #awesome {
    width: 100%;
    max-width: 476px;
  }
</style>
