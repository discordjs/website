<template>
  <div id="class-overview">
    <div class="col" v-if="properties.length > 0">
      <div class="title">Properties</div>
      <ul>
        <li v-for="property in properties" @click="scroll(property.name)">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: property.name } }">{{ property.name }}</router-link>
        </li>
      </ul>
    </div>

    <div class="col" v-if="methods.length > 0">
      <div class="title">Methods</div>
      <ul>
        <li v-for="method in methods" @click="scroll(method.name)">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: method.name } }">{{ method.name }}</router-link>
        </li>
      </ul>
    </div>

    <div class="col" v-if="clarse.events.length > 0">
      <div class="title">Events</div>
      <ul>
        <li v-for="event in clarse.events" @click="scroll(event.name)">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: event.name } }">{{ event.name }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'class-overview',
    props: ['clarse', 'showPrivate'],

    computed: {
      properties() {
        if (this.showPrivate) return this.clarse.properties;
        return this.clarse.properties.filter(p => p.access !== 'private');
      },

      methods() {
        if (this.showPrivate) return this.clarse.methods;
        return this.clarse.methods.filter(p => p.access !== 'private');
      },
    },

    methods: {
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

    .title {
      font-size: 16px;
      font-weight: bold;
      color: lighten($color-content-text, 25%);
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 14px;
      color: lighten($color-content-text, 35%);

      li {
        margin: 0;
        padding: 0;

        a {
          display: block;
          padding: 2px 0;
          margin: 1px 0;
          width: 100%;
          height: 100%;
          color: inherit;
          text-decoration: inherit;

          @include mq($from: desktop) {
            padding-left: 6px;
            border-left: 2px solid $color-inactive-border;
          }

          &:hover {
            color: $color-primary;
            background: darken($color-content-bg, 2%);

            @include mq($from: desktop) {
              border-left: 2px solid;
            }
          }
        }
      }
    }

    .col {
      flex: 1;
      min-width: 100px;
    }

    @include mq($until: desktop) {
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
