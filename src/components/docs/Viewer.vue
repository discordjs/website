<template>
  <div id="docs-viewer">
    <container>
      <sidebar :docs="docs" @showPrivate="setShowPrivate" />
      <transition name="fade-slide" mode="out-in">
        <router-view :docs="docs" :key="key" :showPrivate="showPrivate" />
      </transition>
    </container>

    <div id="docs-meta">
      <p>
        Documentation built at {{ new Date(docs.meta.date).toUTCString() }}.<br />
        Generator: v{{ docs.meta.generator }} &nbsp; Format: {{ docs.meta.format }}
      </p>
    </div>

    <div id="scroll-top" title="Scroll to top" @click="scrollTop"><em class="fa fa-arrow-up"></em></div>
  </div>
</template>

<script>
  import Sidebar from './Sidebar.vue';

  export default {
    name: 'docs-viewer',
    props: ['docs'],
    components: {
      Sidebar,
    },

    data() {
      return {
        showPrivate: false,
      };
    },

    computed: {
      key() {
        const params = this.$route.params;
        if (params.file) return `${params.category}/${params.file}`;
        if (params.search) return 'search';
        return params.class || params.typedef;
      },
    },

    methods: {
      setShowPrivate(show) {
        this.showPrivate = show;
      },

      scrollTop() {
        window.scrollTo(0, 0);
      },
    },

    mounted() {
      this.$nextTick(() => {
        const scroller = document.getElementById('scroll-top');
        let hideTimeout;
        let showTimeout;

        const showListener = () => {
          if ((window.pageYOffset || document.documentElement.scrollTop) > 300) {
            clearTimeout(hideTimeout);
            clearTimeout(showTimeout);
            scroller.style.display = 'block';
            showTimeout = setTimeout(() => { scroller.style.opacity = '1'; }, 20);
            window.removeEventListener('scroll', showListener);
            window.addEventListener('scroll', hideListener);
          }
        };

        const hideListener = () => {
          if ((window.pageYOffset || document.documentElement.scrollTop) < 300) {
            clearTimeout(hideTimeout);
            clearTimeout(showTimeout);
            scroller.style.opacity = '0';
            hideTimeout = setTimeout(() => { scroller.style.display = 'none'; }, 1000);
            window.removeEventListener('scroll', hideListener);
            window.addEventListener('scroll', showListener);
          }
        };

        window.addEventListener('scroll', showListener);
      });
    },
  };
</script>

<style lang="scss">
  @import '../../styles/theming';
  @import '../../styles/mq';

  #docs-viewer {
    background: $color-content-bg;
    color: $color-content-text;
    padding: 16px;

    h1 {
      margin: 0;
    }

    hr {
      border: 0;
      border-bottom: 1px solid #ddd;
      margin: 16px 0;
    }

    pre {
      margin: 16px;
      padding: 8px;
      color: lighten($color-content-text, 20%);
      background: #F0F0F0;
    }

    div.info, div.warn {
      display: inline-block;
      margin: 0;
      padding: 8px;
      border: 1px solid;
      border-left: 2px solid;
    }

    div.info {
      background: lighten($color-info, 25%);
      border-color: lighten($color-info, 15%);
      border-left-color: $color-info;
    }

    div.warn {
      background: lighten($color-warn, 25%);
      border-color: lighten($color-warn, 15%);
      border-left-color: $color-warn;
    }

    .docs-type:not(:last-child):after {
      content: ' or ';
      font-weight: normal;
    }

    & > .container {
      display: flex;

      @include mq($until: tablet) {
        flex-direction: column;
      }
    }
  }

  .docs-page {
    flex: 1 1 auto;
    padding: 16px 32px;

    @include mq($until: tablet) {
      padding: 16px 0;
    }

    img {
      max-width: 100%;
    }
  }

  #docs-meta {
    margin: 30px 0;
    text-align: center;
    font-size: 0.8em;

    p {
      display: inline-block;
      color: lighten($color-content-text, 60%);
      transition: all 0.3s;

      &:hover {
        color: lighten($color-content-text, 15%);
        transform: scale(1.1);
      }
    }
  }

  .badge {
    margin-left: 2px;
    padding: 5px;
    color: white;
    background: lighten($color-primary, 10%);
    border-radius: 3px;
    text-transform: uppercase;
    font-size: 0.85rem;
    font-weight: bold;

    &:first-of-type {
      margin-left: 8px;
    }

    &.warn {
      background: lighten($color-warn, 5%);
    }
  }

  .small-badge {
    float: right;
    width: 1em;
    margin-right: 8px;
    padding: 2px 1px;
    border-radius: 3px;
    background: lighten($color-primary, 25%);
    color: white;
    text-align: center;
    transition: background-color 0.3s;

    &.warn {
      background: lighten($color-warn, 20%);
    }

    @include mq($until: tablet) {
      margin-right: 0;
    }
  }

  #scroll-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px;
    border-radius: 3px;
    background: $color-primary;
    color: white;
    cursor: pointer;

    transition: opacity 0.5s, background 0.3s;
    display: none;
    opacity: 0;

    &:hover {
      background: lighten($color-primary, 15%);
    }
  }
</style>
