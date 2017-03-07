<template>
  <div v-if="clarse" id="class-viewer" class="docs-page">
    <source-button :meta="clarse.meta" :docs="docs" />

    <h1>{{ clarse.name }}</h1>
    <p class="class-name-extra">
      <span v-if="clarse.extends">extends <type-link :type="clarse.extends" :docs="docs" /></span>
      <span v-if="clarse.implements">implements <type-link :type="clarse.implements" :docs="docs" /></span>
    </p>
    <span v-if="clarse.abstract" class="badge class-badge" title="This class is abstract, and may not be instantiated itself.">Abstract</span>
    <span v-if="clarse.deprecated" class="badge class-badge warn" title="This class is deprecated, and may be removed in a future version.">Deprecated</span>
    <span v-if="clarse.access === 'private'" class="badge class-badge warn" title="This class is private, and may change or be removed at any time.">Private</span>

    <p class="class-desc" v-html="description" v-if="clarse.description"></p>
    <see v-if="clarse.see" :see="clarse.see" :docs="docs" />

    <div id="class-constructor" v-if="clarse.construct && (showPrivate || clarse.construct.access !== 'private')">
      <h2>Constructor</h2>
      <pre><code class="js">new {{ docs.global }}.{{ clarse.name }}(<span class="constructor-param" v-for="param in constructorParams">{{ param.name }}</span>);</code></pre>
      <param-table :params="clarse.construct.params" :docs="docs" />
    </div>

    <overview :properties="properties" :methods="methods" :events="clarse.events" />

    <h2 v-if="properties && properties.length > 0">Properties</h2>
    <property v-for="prop in properties" :prop="prop" :docs="docs" :key="prop" />

    <h2 v-if="methods && methods.length > 0">Methods</h2>
    <method v-for="method in methods" :method="method" :docs="docs" :key="method" />

    <h2 v-if="clarse.events && clarse.events.length > 0">Events</h2>
    <event v-for="event in clarse.events" :event="event" :docs="docs" :key="event" />
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
        if (!this.clarse.props) return null;
        let props;
        if (this.showPrivate) props = this.clarse.props;
        else props = this.clarse.props.filter(p => p.access !== 'private');
        return props.sort((a, b) =>
          `${a.scope === 'static' ? 'ZZZ' : ''}${a.name}`.localeCompare(`${b.scope === 'static' ? 'ZZZ' : ''}${b.name}`)
        );
      },

      methods() {
        if (!this.clarse.methods) return null;
        let methods;
        if (this.showPrivate) methods = this.clarse.methods;
        else methods = this.clarse.methods.filter(p => p.access !== 'private');
        return methods.sort((a, b) =>
          `${a.scope === 'static' ? 'ZZZ' : ''}${a.name}`.localeCompare(`${b.scope === 'static' ? 'ZZZ' : ''}${b.name}`)
        );
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
    h1, .class-name-extra {
      display: inline-block;
    }

    h1 {
      color: #333;
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

    .class-name-extra {
      position: relative;
      top: -1px;
      left: 0.2rem;
      color: lighten($color-content-text, 40%);
      font-family: $font-header;
      font-size: 1.1rem;
    }

    .class-badge {
      position: relative;
      top: -4px;
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
        transition: opacity 0.3s;

        @include mq($from: desktop) {
          opacity: 0;
        }
      }

      &:hover .source-button {
        opacity: 1;
      }
    }

    .class-item-details {
      margin-top: 8px;
      padding: 6px 0 6px 8px;
      border-left: 2px solid darken($color-content-bg, 15%);
    }

    code {
      font-family: $font-monospace;
      font-size: 0.8rem;
    }

    :not(pre) > code {
      background: darken($color-content-bg, 3.5%);
      border-radius: 2px;
    }
  }
</style>
