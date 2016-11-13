<template>
  <div class="classOverview">
    <div class="col" v-if="publicProperties.length > 0">
      <span class="title">Properties</span>
      <ul>
        <li v-for="property in publicProperties">
          <a v-link="{ name: 'classview', query: { scrollto: property.name } }" @click='scroll(property.name)'>{{ property.name }}</a>
        </li>
      </ul>
    </div>
    <div class="col" v-if="publicMethods.length > 0">
      <span class="title">Methods</span>
      <ul>
        <li v-for="method in publicMethods">
          <a v-link="{ name: 'classview', query: { scrollto: method.name } }" @click='scroll(method.name)'>{{ method.name }}</a>
        </li>
      </ul>
    </div>
    <div class="col" v-if="jsclass.events.length > 0">
      <span class="title">Events</span>
      <ul>
        <li v-for="event in jsclass.events">
          <a v-link="{ name: 'classview', query: { scrollto: event.name } }" @click='scroll(event.name)'>{{ event.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['jsclass'],
  computed: {
    publicProperties() {
      return this.jsclass.properties.filter(p => p.access !== 'private');
    },
    publicMethods() {
      return this.jsclass.methods.filter(m => m.access !== 'private');
    },
  },
  methods: {
    scroll(to) {
      this.$router.go({ name: 'classview', query: { scrollto: to } });

      const elem = document.getElementById(`doc_for_${to}`);
      elem.setAttribute('data-selected', true);
      setTimeout(() => elem.removeAttribute('data-selected'), 1);
      elem.scrollIntoView(true);
      window.scrollBy(0, -100);
    },
  },
  route: {
    canReuse() {
      return false;
    },
  },
};
</script>
