<template>
  <div class="source-button">
    <a :href="`${sourceURL(meta.path, meta.file, meta.line)}`" title="Source">
      <em class="fa fa-code"></em>
    </a>
  </div>
</template>

<script>
  import { sourceURL } from '../../util';

  export default {
    name: 'source-button',
    props: ['meta', 'docs'],

    methods: {
      sourceURL(path, file, line) {
        return sourceURL(this.docs.source, this.docs.tag, path, file, line);
      },
    },
  };
</script>

<style lang="scss">
  .source-button {
    display: inline-block;
    float: right;
    font-size: 1.3rem;
  }
</style>
