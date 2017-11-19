<template>
  <footer>
    <container>
      <strong><router-link to="/">discord.js</router-link></strong>
      <p>A powerful library for interacting with the Discord API</p>
      <stats />
      <a href="" id="dark-mode-link" @click="toggleDarkMode">{{ darkMode ? 'Turn on the lights' : 'Turn off the lights' }}</a>
    </container>
  </footer>
</template>

<script>
  import Stats from './Stats.vue';

  export default {
    name: 'footer',
    props: ['darkMode'],
    components: {
      Stats,
    },

    methods: {
      toggleDarkMode(event) {
        this.$emit('toggleDarkMode');
        event.preventDefault();
      },
    },
  };
</script>

<style lang="scss">
  @import '../styles/theming';

  footer {
  	padding: 3rem;
  	background: $color-navbar-bg;
    color: $color-footer-text;

    a {
      text-decoration: none;
      color: $color-footer-text;
    }

    a:hover {
      color: lighten($color-footer-text, 10%);
    }

    .container {
      text-align: center;
    }

    .stats {
  		padding: 0;
      list-style: none;

      li {
        display: inline-block;

        &:not(:last-child):after {
          content: ','
        }
      }
    }
  }

  #dark-mode-link {
    display: inline-block;
    padding: 8px 6px;
    border-radius: 4px;
    background: $color-primary;
    color: white;
    font-size: 0.9rem;

    &:hover {
      background: lighten($color-primary, 10%);
    }
  }
</style>
