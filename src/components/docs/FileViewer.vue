<template>
  <div id="file-viewer" class="docs-page" v-html="html"></div>
</template>

<script>
  import Vue from 'vue';
  import { hljs } from '../../util';

  export default {
    name: 'file-viewer',
    props: ['docs'],

    data() {
      return {
        file: this.docs.custom[this.$route.params.category].find(f => f.id === this.$route.params.file),
      };
    },

    computed: {
      html() {
        const content = this.file.type !== 'js' ? this.file.content : `\`\`\`js\n${this.file.content}\n\`\`\``;
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

    :not(pre) > code, .lang-bash {
      background: #f5f5f5;
    }
  }
</style>
