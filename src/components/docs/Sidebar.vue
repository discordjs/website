<template>
  <div id="docs-sidebar">
    <div id="open-btn" @click="toggle"><em class="fa fa-bars"></em></div>

    <div id="docs-sidebar-content" :class="visible ? 'open' : 'closed'">
      <div id="close-btn" @click="toggle">
        <em class="fa fa-arrow-left" aria-hidden="true"></em>
      </div>

      <em id="docs-visibility" class="fa" :class="showPrivate ? 'fa-eye' : 'fa-eye-slash'" :title="showPrivate ? 'Hide private' : 'Show private'" @click="togglePrivate"></em>

      <ul>
        <li v-for="(category, categoryID) in docs.custom">
          {{ category.name }}
          <ul>
            <li v-for="(file, fileID) in category.files">
              <router-link :to="{ name: 'docs-file', params: { category: categoryID, file: fileID } }">
                {{ file.name }}
              </router-link>
            </li>
          </ul>
        </li>

        <li>
          Classes
          <transition-group name="animated-list" tag="ul">
            <li v-for="clarse in docs.classes" v-if="showPrivate || clarse.access !== 'private'" :key="clarse.name" class="animated-list-item">
              <router-link exact :to="{ name: 'docs-class', params: { class: clarse.name } }">
                {{ clarse.name }}
              </router-link>
            </li>
          </transition-group>
        </li>

        <li>
          Typedefs
          <ul>
            <li v-for="typedef in docs.typedefs" v-if="showPrivate || typedef.access !== 'private'">
              <router-link exact :to="{ name: 'docs-typedef', params: { typedef: typedef.name } }">
                {{ typedef.name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'docs-sidebar',
    props: ['docs'],

    data() {
      return {
        visible: false,
        showPrivate: false,
      };
    },

    methods: {
      toggle() {
        this.visible = !this.visible;
      },

      togglePrivate() {
        this.showPrivate = !this.showPrivate;
      },
    },

    watch: {
      showPrivate(to) {
        this.$emit('showPrivate', to);
      },

      $route(to) {
        if (this.visible) this.visible = false;
        if (!to.query.scrollTo && (window.pageYOffset || document.documentElement.scrollTop) > 300) {
          window.scrollTo(0, 90);
        }
      },
    },
  };
</script>

<style lang="scss">
  @import '../../styles/theming';
  @import '../../styles/mq';

  #docs-sidebar {
    flex: 0 1 auto;
    border-right: 1px solid $color-inactive-border;

    @include mq($until: tablet) {
      border-right: 0;

      #docs-sidebar-content {
        z-index: 10;
        position: fixed;
        top: 0;
        bottom: 0;
        left: -200px;
        right: 0;
        width: 0;
        max-height: 100%;
        padding: 0;
        overflow: auto;
        background: darken($color-content-bg, 2%);
        box-shadow: 0 0 160px black;
        transition: 300ms right, 300ms width, 300ms left;

        li {
          font-size: 1.25rem !important;
          padding: 16px !important;
        }

        &.open {
          left: 0;
          width: 100%;
          right: 10px;
        }
      }
    }

    #open-btn, #close-btn {
      z-index: 1;
      font-size: 1.1rem;
      cursor: pointer;

      @include mq($from: tablet) {
        display: none;
      }
    }

    #close-btn {
      text-align: center;
      padding: 16px 0;
      color: white;
      background: $color-primary;
    }

    ul {
      margin: 0 0 16px 0;
      padding: 0;
      list-style: none;

      li {
        text-transform: uppercase;
        font-size: 1rem;
        font-weight: bold;
        color: black;
      }

      ul li {
        padding: 0;
        text-transform: none;
        font-size: 0.875rem;
        font-weight: normal;
        color: lighten($color-content-text, 20%);

        a {
          display: block;
          padding: 4px 32px 4px 4px;
          color: inherit;
          text-decoration: none;
          border-left: 2px solid transparentize($color-primary, 1);

          &:hover {
            border-color: $color-primary;
            color: $color-primary;
            background: darken($color-content-bg, 2%);
          }
        }
      }
    }

    .router-link-active {
      background: darken($color-content-bg, 4%);
    }
  }

  #docs-visibility {
    float: right;
    position: relative;
    right: 10px;
    bottom: 8px;
    padding: 5px;
    cursor: pointer;

    @include mq($until: tablet) {
      display: none;
    }
  }
</style>
