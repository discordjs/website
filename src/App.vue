<template>
  <div id="app">
    <app-navbar :repository="repository" />
    <router-view :darkMode="darkMode" :konami="konami" @toggleDarkMode="toggleDarkMode" @setRepository="setRepository" />
    <app-footer :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />

    <transition name="fade-slide-vertical">
      <snackbar action="Reload" @click="refresh" v-if="updateExists">An updated version of the site is available.</snackbar>
    </transition>
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';
import Snackbar from './components/Snackbar.vue';
import MainSource from './data/MainSource';
import Konami from 'konami-code-js';

let konami = null;

export default {
  name: 'app',
  components: {
    AppNavbar,
    AppFooter,
    Snackbar,
  },

  data() {
    const darkMode = localStorage.getItem('dark-mode');
    return {
      darkMode: darkMode !== 'false' && darkMode !== null,
      repository: MainSource.repo,
      updateExists: false,
      refreshing: false,
      konami: false,
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

    swUpdated(event) {
      this.registration = event.detail;
      this.updateExists = true;
    },

    refresh() {
      if (!this.updateExists) return;
      this.updateExists = false;
      if (!this.registration || !this.registration.waiting) return;
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    },

    poop() {
      // Create the poop
      const poop = document.createElement('div');
      poop.className = 'poop';
      poop.innerHTML = '💩';

      // Set the poop's travel time and how spinny it is
      const duration = (Math.random() * 4000) + 1000;
      poop.style.transition = `top ${duration}ms linear, left ${duration}ms linear`;
      poop.style.animation = `spin ${duration / 3000}s infinite linear`;

      // Determine the poop's initial location and final destination
      const side = Math.floor(Math.random() * 4) + 1;
      const initial = {
        top: `${side === 2 || side === 4 ? Math.random() * window.innerHeight :
          side === 1 ? -200 : window.innerHeight + 200}px`,
        left: `${side === 1 || side === 3 ? Math.random() * window.innerWidth :
          side === 4 ? -200 : window.innerWidth + 200}px`,
      };
      const final = {
        top: `${side === 2 || side === 4 ? Math.random() * window.innerHeight :
          side === 1 ? window.innerHeight + 200 : -200}px`,
        left: `${side === 1 || side === 3 ? Math.random() * window.innerWidth :
          side === 4 ? window.innerWidth + 200 : -200}px`,
      };

      // Pinpoint and relocate the poop
      Object.assign(poop.style, initial);
      window.setTimeout(() => { Object.assign(poop.style, final); }, 100);

      // Add the poop to the page and remove it when its adventure is complete
      document.body.appendChild(poop);
      window.setTimeout(() => { document.body.removeChild(poop); }, duration + 100);

      // Take another dump
      window.setTimeout(() => this.poop(), (Math.random() * 10000) + 1000);
    },
  },

  created() {
    document.addEventListener('swUpdated', this.swUpdated, { once: true });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
  },

  mounted() {
    if (this.darkMode) this.$el.classList.add('dark');
    if (!konami) {
      konami = new Konami(() => {
        this.konami = true;
        this.poop();
        konami.disable();
      });
    }
  },
};
</script>

<style>
  .poop {
    z-index: 1000;
    position: fixed;
    font-size: 3rem;
  }
</style>
