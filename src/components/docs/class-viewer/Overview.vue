<template>
  <div id="class-overview">
    <div class="col" v-if="properties && properties.length > 0">
      <div class="title">Properties</div>
      <ul>
        <li v-for="property in properties" @click="scroll(scopedScrollTo(property))">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: scopedScrollTo(property) } }">
            {{ property.name }}
            <span v-if="property.scope === 'static'" class="overview-badge">S</span>
            <span v-if="property.abstract" class="overview-badge">A</span>
            <span v-if="property.deprecated" class="overview-badge warn">D</span>
            <span v-if="property.access === 'private'" class="overview-badge warn">P</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="col" v-if="methods && methods.length > 0">
      <div class="title">Methods</div>
      <ul>
        <li v-for="method in methods" @click="scroll(scopedScrollTo(method))">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: scopedScrollTo(method) } }">
            {{ method.name }}
            <span v-if="method.scope === 'static'" class="overview-badge">S</span>
            <span v-if="method.abstract" class="overview-badge">A</span>
            <span v-if="method.deprecated" class="overview-badge warn">D</span>
            <span v-if="method.access === 'private'" class="overview-badge warn">P</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="col" v-if="events && events.length > 0">
      <div class="title">Events</div>
      <ul>
        <li v-for="event in events" @click="scroll(event.name)">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: event.name } }">
            {{ event.name }}
            <span v-if="event.deprecated" class="overview-badge warn">D</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'class-overview',
    props: ['properties', 'methods', 'events'],

    methods: {
      scopedScrollTo(item) {
        return `${item.scope === 'static' ? 's-' : ''}${item.name}`;
      },

      scroll(to) {
        const el = document.getElementById(`doc-for-${to}`);
        el.setAttribute('data-scrolled', true);
        setTimeout(() => el.setAttribute('data-scrolled', false), 1000);
        el.scrollIntoView(true);
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

            .overview-badge {
              background: lighten($color-primary, 10%);

              &.warn {
                background: lighten($color-warn, 5%);
              }
            }

            @include mq($from: tablet) {
              border-left: 2px solid;
            }
          }
        }
      }
    }

    .col {
      flex: 1 1 auto;
      min-width: 100px;
    }

    .overview-badge {
      display: inline-block;
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
</style>
