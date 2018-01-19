<template>
  <div id="app">
    <app-navbar :repository="repository" />
    <router-view :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" @setRepository="setRepository" />
    <app-footer :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />
  </div>
</template>

<script>
  import AppNavbar from './components/AppNavbar.vue';
  import AppFooter from './components/AppFooter.vue';
  import MainSource from './data/MainSource';

  export default {
    name: 'app',
    components: {
      AppNavbar,
      AppFooter,
    },

    data() {
      const darkMode = localStorage.getItem('dark-mode');
      return {
        darkMode: darkMode !== 'false' && darkMode !== null,
        repository: MainSource.repo,
      };
    },

    methods: {
      toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('dark-mode', this.darkMode);
        if (this.darkMode) this.$el.classList.add('dark'); else this.$el.classList.remove('dark');
      },

      setRepository(repo) {
        this.repository = repo;
      },
    },

    mounted() {
      if (this.darkMode) this.$el.classList.add('dark');
    },
  };
</script>
