<template>
  <div id="docs-sidebar">
    <div id="open-btn" @click="toggle"><em class="fa fa-bars"></em></div>

    <div id="docs-sidebar-content" :class="visible ? 'open' : 'closed'">
      <div id="close-btn" @click="toggle">
        <em class="fa fa-arrow-left" aria-hidden="true"></em>
      </div>

      <em id="docs-visibility" class="fa toggle" :class="showPrivate ? 'fa-eye' : 'fa-eye-slash'" :title="togglePrivateLabel" @click="togglePrivate"></em>
      <em id="docs-brightness" class="fa toggle" :class="darkMode ? 'fa-moon-o' : 'fa-sun-o'" :title="toggleDarkModeLabel" @click="toggleDarkMode"></em>

      <ul>
        <li v-for="(category, categoryID) in docs.custom" :key="categoryID">
          {{ category.name }}
          <ul>
            <li v-for="(file, fileID) in category.files" :key="fileID">
              <router-link :to="{ name: 'docs-file', params: { category: categoryID, file: fileID } }">
                {{ file.name }}
              </router-link>
            </li>
          </ul>
        </li>

        <li v-if="visibleClasses.length > 0">
          Classes
          <transition-group name="animated-list" tag="ul">
            <li v-for="clarse in visibleClasses" :key="clarse.name" class="animated-list-item">
              <router-link exact :to="{ name: 'docs-class', params: { class: clarse.name } }">
                {{ clarse.name }}
              </router-link>
            </li>
          </transition-group>
        </li>

        <li v-if="visibleTypedefs.length > 0">
          Typedefs
          <ul>
            <li v-for="typedef in visibleTypedefs" :key="typedef.name">
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
  props: ['docs', 'darkMode'],

  data() {
    return {
      visible: false,
      showPrivate: false,
    };
  },

  computed: {
    visibleClasses() {
      return this.showPrivate ? this.docs.classes : this.docs.classes.filter(c => c.access !== 'private');
    },

    visibleTypedefs() {
      return this.showPrivate ? this.docs.typedefs : this.docs.typedefs.filter(t => t.access !== 'private');
    },

    togglePrivateLabel() {
      return `Private items are ${this.showPrivate ? 'shown' : 'hidden'}. Click to toggle.`;
    },

    toggleDarkModeLabel() {
      return `The lights are ${this.darkMode ? 'off' : 'on'}. Click to toggle.`;
    },
  },

  methods: {
    toggle() {
      this.visible = !this.visible;
    },

    togglePrivate() {
      this.showPrivate = !this.showPrivate;
    },

    toggleDarkMode() {
      this.$emit('toggleDarkMode');
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
        transition: 0.3s right, 0.3s width, 0.3s left;

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
        color: darken($color-content-text, 6%);
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

  .toggle {
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

  #app.dark #docs-sidebar {
    border-right-color: $color-inactive-border-dark;

    @include mq($until: tablet) {
      #docs-sidebar-content {
        background: lighten($color-content-bg-dark, 2%);
      }
    }

    ul {
      li {
        color: lighten($color-content-text-dark, 6%);
      }

      ul li {
        color: darken($color-content-text-dark, 20%);

        a:hover {
          background: lighten($color-content-bg-dark, 2%);
        }
      }
    }

    .router-link-active {
      background: lighten($color-content-bg-dark, 4%);
    }
  }
</style>
