<template>
  <span class="docs-type-link">
    <span v-if="!link" :title="type[0] === '*' ? 'Any type' : null">{{ typeName }}</span><!--
  --><router-link :to="link" v-else-if="typeof link === 'object'">{{ typeName }}</router-link><!--
  --><a :href="link" v-else>{{ typeName }}</a><!--
  --><span v-if="type[1]">{{ type[1] }}</span>
  </span>
</template>

<script>
  export default {
    name: 'type-link',
    props: ['docs', 'type'],
    computed: {
      typeName() {
        if (this.type[0] === 'function') return 'Function';
        return this.type[0];
      },

      link() {
        if (this.docs.links[this.type[0]]) return this.docs.links[this.type[0]];
        return null;
      },
    },
  };
</script>
