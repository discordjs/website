<template>
  <span class="docs-type-link">
    <router-link :to="link" v-if="typeof link !== 'string'">{{ type[0] }}</router-link><!--
  --><a :href="link" v-else>{{ type[0] }}</a><!--
  --><span v-if="type[1]">{{ type[1] }}</span>
  </span>
</template>

<script>
  export default {
    name: 'type-link',
    props: ['docs', 'type'],
    computed: {
      link() {
        if (this.docs.links[this.type[0]]) return this.docs.links[this.type[0]];
        return {};
      },
    },
  };
</script>
