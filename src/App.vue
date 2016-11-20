<template>
  <div id="app">
    <app-navbar />
    <router-view />
    <app-footer />
  </div>
</template>

<script>
  import AppNavbar from './components/AppNavbar.vue';
  import AppFooter from './components/AppFooter.vue';

  export default {
    name: 'app',
    components: {
      AppNavbar,
      AppFooter,
    },
  };
</script>
