<template>
  <div id="class-overview">
    <div class="col" v-if="properties && properties.length > 0">
      <div class="title">Properties</div>
      <ul>
        <li v-for="property in properties" @click="scroll(scopedScrollTo(property))">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: scopedScrollTo(property) } }">{{ property.name }}</router-link>
        </li>
      </ul>
    </div>

    <div class="col" v-if="methods && methods.length > 0">
      <div class="title">Methods</div>
      <ul>
        <li v-for="method in methods" @click="scroll(scopedScrollTo(method))">
          <router-link :to="{ name: 'docs-class', query: { scrollTo: scopedScrollTo(method) } }">{{ method.name }}</router-link>
        </li>
      </ul>
    </div>

    <div class="col" v-if="clarse.events && clarse.events.length > 0">
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
        if (this.showPrivate) return this.clarse.props;
        if (!this.clarse.props) return null;
        return this.clarse.props.filter(p => p.access !== 'private');
      },

      methods() {
        if (this.showPrivate) return this.clarse.methods;
        if (!this.clarse.methods) return null;
        return this.clarse.methods.filter(p => p.access !== 'private');
      },
    },

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
