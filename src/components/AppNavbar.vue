<template>
  <header>
    <container>
      <router-link to="/">discord.js</router-link>

      <nav>
        <router-link to="/docs">Documentation</router-link><!--
        --><a :href="`https://github.com/${repository}`">GitHub</a><!--
        --><a href="https://discordjs.guide/">Guide</a>
      </nav>
    </container>
  </header>
</template>

<script>
export default {
  name: 'navbar',
  props: ['repository'],
};
</script>

<style lang="scss">
  @import '../styles/theming';
  @import '../styles/mq';

  header {
    height: 3rem;
    line-height: 3rem;
    background: $color-navbar-bg;

    a {
      display: inline-block;
      padding: 0 16px;
      text-decoration: none;
      color: white;
    }

    @include mq($until: tablet) {
      a {
        padding: 0 7px;
      }
    }

    & .container > a {
      background: $color-primary;
      font-size: 1.1rem;

      &:hover {
        color: white;
        background: darken($color-primary, 10%);
      }
    }

    nav {
      float: right;

      a:hover {
        color: white;
        background: darken($color-navbar-bg, 10%);
      }
    }
  }
</style>
