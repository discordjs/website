<template>
  <div v-if="clarse" id="class-viewer" class="docs-page">
    <source-button :meta="clarse.meta" :docs="docs" />

    <h1>{{ clarse.name }}</h1>
    <p id="class-extends" v-if="clarse.extends">extends <type-link :type="clarse.extends" :docs="docs" /></p>
    <span v-if="clarse.access === 'private'" class="class-item-badge" title="This class is private, and may not exist as-is in future versions.">Private</span>
    <p class="class-desc" v-html="description" v-if="clarse.description"></p>
    <see v-if="clarse.see" :see="clarse.see" :docs="docs" />

    <div id="class-constructor" v-if="clarse.construct && (showPrivate || clarse.construct.access !== 'private')">
      <h2>Constructor</h2>
      <pre><code class="js">new {{ docs.global }}.{{ clarse.name }}(<span class="constructor-param" v-for="param in constructorParams">{{ param.name }}</span>);</code></pre>
      <param-table :params="clarse.construct.params" :docs="docs" />
    </div>

    <overview :clarse="clarse" :showPrivate="showPrivate" />

    <h2 v-if="properties && properties.length > 0">Properties</h2>
    <property v-for="prop in properties" :prop="prop" :docs="docs" />

    <h2 v-if="methods && methods.length > 0">Methods</h2>
    <method v-for="method in methods" :method="method" :docs="docs" />

    <h2 v-if="clarse.events && clarse.events.length > 0">Events</h2>
    <event v-for="event in clarse.events" :event="event" :docs="docs" />
  </div>
  <unknown-page v-else class="docs-page" />
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
  import See from '../See';
  import { hljs, convertLinks } from '../../../util';

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
      See,
    },

    data() {
      return {
        clarse: this.docs.classes.find(c => c.name === this.$route.params.class),
      };
    },

    computed: {
      constructorParams() {
        if (!this.clarse.construct || !this.clarse.construct.params) return null;
        return this.clarse.construct.params.filter(p => !p.name.includes('.'));
      },

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

      description() {
        return Vue.filter('marked')(convertLinks(this.clarse.description, this.docs, this.$router, this.$route));
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

      @include mq($from: desktop) {
        .source-button {
          opacity: 0;
          transition: opacity 0.3s;
        }

        &:hover .source-button {
          opacity: 1;
        }
      }
    }

    .class-item-details {
      margin-top: 8px;
      padding: 6px 0 6px 8px;
      border-left: 2px solid darken($color-content-bg, 15%);
    }

    .class-item-badge {
      margin-left: 12px;
      padding: 3px 4px;
      color: white;
      background: lighten($color-primary, 10%);
      border-radius: 3px;
    }

    code {
      font-family: $font-monospace;
      font-size: 0.8rem;
    }
  }
</style>
