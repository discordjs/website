<template>
  <a v-if="typeof link !== 'string'" v-link="link" class="typeLink">{{* type[0] }}</a><!--
  --><a v-else :href="link" class="typeLink">{{* type[0] }}</a><!--
  --><span class="typeRest">{{* type[1] }}</span>
</template>
<script>
export default {
  props: ['type'],
  data() {
    return {
      link: this.$root.resolveReference(this.type[0]),
    };
  },
};
</script>
