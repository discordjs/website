<template>
  <div id="docs-search" class="docs-page">
    <h1>Search</h1>
    <input v-model.trim="search" type="search" />


    <transition name="fade" mode="out-in">
      <div v-if="search && search.length > 1">
        <h2 v-if="search && search.length > 1">Results for "{{ search }}"</h2>

        <transition name="fade" mode="out-in">
          <transition-group name="animated-list" tag="ul" v-if="results.count > 0" key="results">
            <li v-if="results.classes.length > 0" key="classes" class="animated-list-item">
              Classes
              <ul>
                <li v-for="clarse in results.classes" :key="clarse">
                  <router-link :to="{ name: 'docs-class', params: { class: clarse } }">{{ clarse }}</router-link>
                </li>
              </ul>
            </li>

            <li v-if="results.typedefs.length > 0" key="typedefs" class="animated-list-item">
              Typedefs
              <ul>
                <li v-for="typedef in results.typedefs">
                  <router-link :to="{ name: 'docs-typedef', params: { typedef } }">{{ typedef }}</router-link>
                </li>
              </ul>
            </li>

            <li v-if="results.methods.length > 0"  key="methods" class="animated-list-item">
              Methods
              <ul>
                <li v-for="method in results.methods">
                  <router-link :to="{ name: 'docs-class', params: { class: method.class }, query: { scrollTo: scopedScrollTo(method) } }">
                    {{ method.class }}{{ method.scope === 'static' ? '.' : '#' }}{{ method.name }}
                  </router-link>
                </li>
              </ul>
            </li>

            <li v-if="results.props.length > 0" key="properties" class="animated-list-item">
              Properties
              <ul>
                <li v-for="prop in results.props">
                  <router-link :to="{ name: 'docs-class', params: { class: prop.class }, query: { scrollTo: scopedScrollTo(prop) } }">
                    {{ prop.class }}{{ prop.scope === 'static' ? '.' : '#' }}{{ prop.name }}
                  </router-link>
                </li>
              </ul>
            </li>

            <li v-if="results.events.length > 0" key="events" class="animated-list-item">
              Events
              <ul>
                <li v-for="event in results.events">
                  <router-link :to="{ name: 'docs-class', params: { class: event.class }, query: { scrollTo: event.name } }">
                    {{ event.class }}#{{ event.name }}
                  </router-link>
                </li>
              </ul>
            </li>
          </transition-group>

          <p v-else key="empty">No results.</p>
        </transition>
      </div>

      <p v-else key="short">Your search query must be at least two characters.</p>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'docs-search',
    props: ['docs', 'showPrivate'],

    data() {
      return {
        search: this.$route.query.q,
      };
    },

    computed: {
      results() {
        const q = this.search.toLowerCase();
        const results = {
          classes: [],
          typedefs: [],
          methods: [],
          props: [],
          events: [],
          count: 0,
        };

        this.docs.classes.forEach(c => {
          if (!this.showPrivate && c.access === 'private') return;

          if (c.name.toLowerCase().includes(q)) {
            results.classes.push(c.name);
            results.count++;
          }

          if (c.methods) {
            c.methods.forEach(m => {
              if (!this.showPrivate && m.access === 'private') return;
              if (m.name.toLowerCase().includes(q)) {
                results.methods.push({
                  name: m.name,
                  scope: m.scope,
                  class: c.name,
                });
                results.count++;
              }
            });
          }

          if (c.props) {
            c.props.forEach(p => {
              if (!this.showPrivate && p.access === 'private') return;
              if (p.name.toLowerCase().includes(q)) {
                results.props.push({
                  name: p.name,
                  scope: p.scope,
                  class: c.name,
                });
                results.count++;
              }
            });
          }

          if (c.events) {
            c.events.forEach(e => {
              if (!this.showPrivate && e.access === 'private') return;
              if (e.name.toLowerCase().includes(q)) {
                results.events.push({
                  name: e.name,
                  class: c.name,
                });
                results.count++;
              }
            });
          }
        });

        this.docs.typedefs.forEach(t => {
          if (t.name.toLowerCase().includes(q)) {
            results.typedefs.push(t.name);
            results.count++;
          }
        });

        return results;
      },
    },

    methods: {
      scopedScrollTo(item) {
        return `${item.scope === 'static' ? 's-' : ''}${item.name}`;
      },
    },

    watch: {
      $route(to) {
        this.search = to.query.q;
      },

      search(q) {
        if (this.$route.query.q === q) return;
        if (this.$route.query.q) this.$router.replace({ name: 'docs-search', query: { q } });
        else this.$router.push({ name: 'docs-search', query: { q } });
      },
    },
  };
</script>

<style lang="scss">
  @import '../../styles/mq';

  #docs-search {
    padding: 16px 32px;

    input {
      margin: 4px 2px;
      width: 16rem;
      max-width: 100%;

      @include mq($from: tablet) {
        display: none;
      }
    }

    ul {
      margin-bottom: 24px;
    }
  }
</style>
