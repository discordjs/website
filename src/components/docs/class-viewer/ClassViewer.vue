<template>
  <div id="class-viewer" class="docs-page">
    <source-button :meta="clarse.meta" :docs="docs" />

    <h1>{{ clarse.name }}</h1>
    <p id="class-extends" v-if="clarse.extends">extends <type-link :type="clarse.extends" :docs="docs" /></p>
    <p class="class-desc" v-html="description" v-if="clarse.description"></p>

    <div id="class-constructor" v-if="clarse.classConstructor && (showPrivate || clarse.classConstructor.access !== 'private')">
      <h2>Constructor</h2>
      <pre><code class="js">new Discord.{{ clarse.name }}(<span class="constructor-param" v-for="param in constructorParams">{{ param.name }}</span>);</code></pre>
      <param-table :params="clarse.classConstructor.params" :docs="docs" />
    </div>

    <overview :clarse="clarse" :showPrivate="showPrivate" />

    <h2 v-if="properties.length > 0">Properties</h2>
    <property v-for="prop in properties" :prop="prop" :docs="docs" />

    <h2 v-if="methods.length > 0">Methods</h2>
    <method v-for="method in methods" :method="method" :docs="docs" />

    <h2 v-if="clarse.events.length > 0">Events</h2>
    <event v-for="event in clarse.events" :event="event" :docs="docs" />
  </div>
</template>

<script>
  import Vue from 'vue';
  import TypeLink from '../TypeLink.vue';
  import ParamTable from './ParamTable.vue';
  import Overview from './Overview';
  import Property from './Property';
  import Method from './Method';
  import Event from './Event';
  import SourceButton from '../SourceButton.vue';
  import { hljs } from '../../../util';

  export default {
    name: 'class-viewer',
    props: ['docs', 'showPrivate'],
    components: {
      TypeLink,
      ParamTable,
      Overview,
      Property,
      Method,
      Event,
      SourceButton,
    },

    data() {
      return {
        clarse: this.docs.classes.find(c => c.name === this.$route.params.class),
      };
    },

    computed: {
      constructorParams() {
        return this.clarse.classConstructor.params.filter(p => !p.name.includes('.'));
      },

      properties() {
        if (this.showPrivate) return this.clarse.properties;
        return this.clarse.properties.filter(p => p.access !== 'private');
      },

      methods() {
        if (this.showPrivate) return this.clarse.methods;
        return this.clarse.methods.filter(p => p.access !== 'private');
      },

      description() {
        return Vue.filter('marked')(this.clarse.description);
      },
    },

    mounted() {
      this.$nextTick(() => {
        for (const el of this.$el.querySelectorAll('pre code')) hljs(el);
      });
    },
  };
</script>

<style lang="scss">
  @import '../../../styles/theming';
  @import '../../../styles/mq';

  #class-viewer {
    h1, #class-extends {
      display: inline-block;
    }

    h2 {
      margin-top: 40px;
    }

    h3 {
      display: inline-block;
      margin: 0;
      font-family: $font-monospace;

      a {
        color: inherit;
        text-decoration: none;

        &:hover {
          color: $color-primary;
        }
      }
    }

    #class-extends {
      color: lighten($color-content-text, 40%);
      font-family: $font-header;
      font-size: 1.1rem;
    }

    #class-constructor {
      margin-top: 16px;

      pre, .param-table {
        margin-left: 10px;
      }
    }

    .constructor-param:not(:last-child):after {
      content: ', ';
    }

    .class-item {
      margin: 20px 2px;
      padding: 8px;

      .source-button {
        float: none;
        position: relative;
        left: -8px;
      }
    }

    .class-item-details {
      margin-top: 8px;
      padding: 6px 0 6px 8px;
      border-left: 2px solid darken($color-content-bg, 15%);
    }

    .source-button {
      float: right;
    }

    code {
      font-family: $font-monospace;
      font-size: 0.8rem;
    }
  }
</style>
