<template>
  <div id="class-overview">
    <div class="col" v-if="properties && properties.length > 0">
      <div class="title">Properties</div>
      <transition-group name="animated-list" tag="ul">
        <li v-for="property in properties" :key="scopedName(property)" @click="scroll(scopedName(property))" class="animated-list-item">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: scopedName(property) } }">
            {{ property.name }}
            <span v-if="property.scope === 'static'" class="small-badge">S</span>
            <span v-if="property.abstract" class="small-badge">A</span>
            <span v-if="property.deprecated" class="small-badge warn">D</span>
            <span v-if="property.access === 'private'" class="small-badge warn">P</span>
          </router-link>
        </li>
      </transition-group>
    </div>

    <div class="col" v-if="methods && methods.length > 0">
      <div class="title">Methods</div>
      <transition-group name="animated-list" tag="ul">
        <li v-for="method in methods" :key="scopedName(method)" @click="scroll(scopedName(method))" class="animated-list-item">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: scopedName(method) } }">
            {{ method.name }}
            <span v-if="method.scope === 'static'" class="small-badge">S</span>
            <span v-if="method.abstract" class="small-badge">A</span>
            <span v-if="method.deprecated" class="small-badge warn">D</span>
            <span v-if="method.access === 'private'" class="small-badge warn">P</span>
          </router-link>
        </li>
      </transition-group>
    </div>

    <div class="col" v-if="events && events.length > 0">
      <div class="title">Events</div>
      <ul>
        <li v-for="event in events" :key="event.name" @click="scroll(`e-${event.name}`)">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: `e-${event.name}` } }">
            {{ event.name }}
            <span v-if="event.deprecated" class="small-badge warn">D</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { scopedName } from '../../../util';

export default {
  name: 'class-overview',
  props: ['properties', 'methods', 'events'],

  methods: {
    scopedName,

    scroll(to) {
      const el = document.getElementById(`doc-for-${to}`);
      el.setAttribute('data-scrolled', true);
      setTimeout(() => el.setAttribute('data-scrolled', false), 1000);
      setTimeout(() => el.removeAttribute('data-scrolled'), 2000);
      el.scrollIntoView();
      window.scrollBy(0, -50);
    },
  },
};
</script>

<style lang="scss">
  @import '../../../styles/theming';
  @import '../../../styles/mq';

  #class-overview {
    display: flex;
    flex-wrap: wrap;
    margin: 48px 0;
    min-width: 0;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: lighten($color-content-text, 25%);
    }

    ul {
      margin: 0;
      padding: 0;
      font-size: 0.875rem;
      color: lighten($color-content-text, 35%);

      li {
        display: block;
        margin: 0;
        padding: 0;

        a {
          display: block;
          padding: 3px 0;
          color: inherit;
          text-decoration: inherit;

          @include mq($from: tablet) {
            padding-left: 6px;
            border-left: 2px solid $color-inactive-border;
          }

          &:hover {
            color: $color-primary;
            background: darken($color-content-bg, 2%);

            .small-badge {
              opacity: 1;
            }

            @include mq($from: tablet) {
              border-left: 2px solid !important;
            }
          }
        }
      }
    }

    .col {
      flex: 1 1 auto;
      min-width: 100px;
    }

    @include mq($until: tablet) {
      flex-direction: column;

      li {
        padding: 6px 0;
      }

      .col {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid $color-inactive-border;
      }
    }
  }

  #app.dark #class-overview {
    .title {
      color: darken($color-content-text-dark, 25%);
    }

    ul {
      color: darken($color-content-text-dark, 35%);

      li {
        a {
          @include mq($from: tablet) {
            border-left-color: $color-inactive-border-dark;
          }

          &:hover {
            background: lighten($color-content-bg-dark, 2%);
          }
        }
      }
    }
  }
</style>
