<template>
  <div id="app">
    <app-navbar />
    <router-view :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />
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

    data() {
      return { darkMode: localStorage.getItem('dark-mode') !== 'false' };
    },

    methods: {
      toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('dark-mode', this.darkMode);
        if (this.darkMode) this.$el.classList.add('dark'); else this.$el.classList.remove('dark');
      },
    },

    mounted() {
      if (this.darkMode) this.$el.classList.add('dark');
    },
  };
</script>
