<template>
  <div class="snackbar">
    <p><slot /></p>
    <button v-if="action" @click="actionTrigger">{{ action }}</button>
  </div>
</template>

<script>
export default {
  name: 'snackbar',
  props: ['action'],

  methods: {
    actionTrigger() {
      this.$emit('actionTrigger');
    },
  },
};
</script>

<style lang="scss">
  @import '../styles/theming';

  .snackbar {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 16px;
    left: 16px;
    padding: 4px;
    border-radius: 3px;
    background: lighten($color-navbar-bg, 8%);
    color: #eee;

    p {
      margin: 0 6px 0 8px;
      margin-left: 8px;
    }

    button {
      margin: 2px 2px 2px 6px;
      padding: 8px 4px;
      border: 0;
      border-radius: 3px;
      background: none;
      color: $color-primary;
      font-family: $font-monospace;
      text-transform: uppercase;
      transition: background 0.3s;

      &:hover {
        cursor: pointer;
        background: transparentize($color-primary, 0.8);
      }

      &:focus {
        background: transparentize($color-primary, 0.6);
      }
    }
  }
</style>
