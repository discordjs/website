<template>
  <div id="docs-body">
    <transition name="fade-resize" mode="out-in">
      <router-view :docs="docs" v-if="docs" />
      <slide v-else>
        <loading v-if="!error" />
        <p v-else id="docs-error">
          Couldn't load the documentation data.
          <pre>{{ error.toString() }}</pre>
        </p>
      </slide>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'docs-loader',
    props: ['source', 'tag'],

    data() {
      return {
        docs: null,
        error: null,
      };
    },

    methods: {
      loadDocs() {
        this.docs = null;
        this.error = null;

        const startSource = this.source;
        this.source.fetchDocs(this.tag).then(docs => {
          if (this.source !== startSource) return;

          // Sort everything
          docs.classes.sort((a, b) => a.name.localeCompare(b.name));
          docs.typedefs.sort((a, b) => a.name.localeCompare(b.name));
          for (const c of docs.classes) {
            if (c.events) c.events.sort((a, b) => a.name.localeCompare(b.name));
            if (c.properties) c.properties.sort((a, b) => a.name.localeCompare(b.name));
            if (c.methods) c.methods.sort((a, b) => a.name.localeCompare(b.name));
          }

          // Built-in type links
          docs.links = {
            string: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
            number: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
            boolean: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
            void: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined',
            Object: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
            Function: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function',
            function: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function',
            Array: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
            Set: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set',
            Map: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
            Date: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
            Promise: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
            Error: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
            EventEmitter: 'https://nodejs.org/dist/latest/docs/api/events.html#events_class_eventemitter',
            Timeout: 'https://nodejs.org/dist/latest/docs/api/timers.html#timers_class_timeout',
            Buffer: 'https://nodejs.org/dist/latest/docs/api/buffer.html#buffer_class_buffer',
            ReadableStream: 'https://nodejs.org/dist/latest/docs/api/stream.html#stream_class_stream_readable',
            ChildProcess: 'https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_class_childprocess',
          };

          // Add links for everything
          for (const c of docs.classes) docs.links[c.name] = { name: 'docs-class', params: { class: c.name } };
          for (const t of docs.typedefs) docs.links[t.name] = { name: 'docs-typedef', params: { typedef: t.name } };

          docs.source = this.source.source;
          docs.tag = this.tag;
          this.docs = docs;
        }).catch(err => {
          this.error = err;
        });
      },

      scroll(fromRoute) {
        if (this.$route.query.scrollTo && this.docs) {
          const scroll = () => {
            let el = document.getElementById(`doc-for-${this.$route.query.scrollTo}`);
            if (!el) el = document.getElementById(this.$route.query.scrollTo);
            if (!el) return;
            el.setAttribute('data-scrolled', true);
            setTimeout(() => el.setAttribute('data-scrolled', false), 1000);
            el.scrollIntoView(true);
            window.scrollBy(0, -50);
          };

          if (fromRoute && this.$route.name !== fromRoute.name) setTimeout(scroll, 400);
          else scroll();
        }
      },
    },

    watch: {
      tag() {
        this.loadDocs();
      },

      docs(to, from) {
        if (!from) setTimeout(this.scroll, 600);
      },

      $route(to, from) {
        this.scroll(from);
      },
    },

    created() {
      this.loadDocs();
    },

    mounted() {
      this.$nextTick(this.scroll);
    },
  };
</script>

<style lang="scss">
  @import '../../styles/theming';

  #docs-body {
    background: $color-content-bg;

    .sk-folding-cube {
      display: block;
      margin: 200px auto;
    }
    .sk-cube:before {
      background: $color-content-bg;
    }
  }

  #docs-error {
    padding: 50px 0;
    text-align: center;
    font-size: 1.5rem;

    pre {
      font-size: 1.0rem;
    }
  }

  [data-scrolled] {
    transition: background 1s;
  }

  [data-scrolled='true'] {
    background: $color-scrolled-bg;
  }
</style>
