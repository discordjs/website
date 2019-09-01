<template>
  <div v-if="file" id="file-viewer" class="docs-page">
    <source-button :path="file.path" :docs="docs" />
    <div v-html="html"></div>
  </div>
  <unknown-page v-else class="docs-page" :darkMode="darkMode" />
</template>

<script>
import Vue from 'vue';
import { hljs } from '../../util';
import SourceButton from './SourceButton.vue';

export default {
  name: 'file-viewer',
  props: ['docs', 'darkMode'],
  components: {
    SourceButton,
  },

  data() {
    if (!this.docs.custom[this.$route.params.category]) return { file: null };
    return {
      file: this.docs.custom[this.$route.params.category].files[this.$route.params.file],
    };
  },

  computed: {
    html() {
      let content;
      if (this.file.type === 'md') content = this.file.content;
      else content = `# ${this.file.name}\n\`\`\`${this.file.type}\n${this.file.content}\n\`\`\``;
      return Vue.filter('marked')(content);
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
  @import '../../styles/theming';
  @import '../../styles/mq';

  #file-viewer {
    code {
      font-family: $font-monospace;
      font-size: 0.8rem;
    }

    :not(pre) > code {
      background: darken($color-content-bg, 3.5%);
      border-radius: 2px;
    }

    table {
      display: block;
      max-width: 100%;
      overflow: auto;
    }
  }

  #app.dark #file-viewer :not(pre):not(.info):not(.warn) > code {
    background: lighten($color-content-bg-dark, 3.5%);
  }
</style>
