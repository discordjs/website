<template>
  <div id="docs-search">
    <h1>Search</h1>
    <input v-model.trim="search" type="search" />

    <h2 v-if="search && search.length > 1">Results for "{{ search }}"</h2>
    <div v-if="search && search.length > 1">
      <ul v-if="results.count > 0">
        <li v-if="results.classes.length > 0">
          Classes
          <ul>
            <li v-for="clarse in results.classes">
              <router-link :to="{ name: 'docs-class', params: { class: clarse } }">{{ clarse }}</router-link>
            </li>
          </ul>
        </li>

        <li v-if="results.typedefs.length > 0">
          Typedefs
          <ul>
            <li v-for="typedef in results.typedefs">
              <router-link :to="{ name: 'docs-typedef', params: { typedef: typedef } }">{{ typedef }}</router-link>
            </li>
          </ul>
        </li>

        <li v-if="results.methods.length > 0">
          Methods
          <ul>
            <li v-for="method in results.methods">
              <router-link :to="{ name: 'docs-class', params: { class: method.class }, query: { scrollTo: method.name } }">{{ method.class }}.{{ method.name }}</router-link>
            </li>
          </ul>
        </li>

        <li v-if="results.props.length > 0">
          Properties
          <ul>
            <li v-for="prop in results.props">
              <router-link :to="{ name: 'docs-class', params: { class: prop.class }, query: { scrollTo: prop.name } }">{{ prop.class }}.{{ prop.name }}</router-link>
            </li>
          </ul>
        </li>

        <li v-if="results.events.length > 0">
          Events
          <ul>
            <li v-for="event in results.events">
              <router-link :to="{ name: 'docs-class', params: { class: event.class }, query: { scrollTo: event.name } }">{{ event.class }}#{{ event.name }}</router-link>
            </li>
          </ul>
        </li>
      </ul>
      <p v-else>No results.</p>
    </div>
    <p v-else>Your search query must be at least two characters.</p>
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

          c.methods.forEach(m => {
            if (!this.showPrivate && m.access === 'private') return;
            if (m.name.toLowerCase().includes(q)) {
              results.methods.push({
                name: m.name,
                class: c.name,
              });
              results.count++;
            }
          });

          c.properties.forEach(p => {
            if (!this.showPrivate && p.access === 'private') return;
            if (p.name.toLowerCase().includes(q)) {
              results.props.push({
                name: p.name,
                class: c.name,
              });
              results.count++;
            }
          });

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
        });

        this.docs.typedefs.forEach(t => {
          if (t.name.toLowerCase().includes(q)) results.typedefs.push(t.name);
        });

        return results;
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
    width: 100%;

    ul {
      margin-bottom: 24px;
    }

    @include mq($from: desktop) {
      input {
        display: none;
      }
    }
  }
</style>
