<template>
  <div class="snackbar">
    <div class="snackbar-text">
      <slot />
    </div>
    <div class="snackbar-action" v-if="action">
      <button @click="click">{{ action }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'snackbar',
  props: ['action'],

  methods: {
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss">
  @import '../styles/theming';
  @import '../styles/mq';

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
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
      0 6px 10px 0 rgba(0, 0, 0, 0.14),
      0 1px 18px 0 rgba(0, 0, 0, 0.12);

    @include mq($until: tablet) {
      width: 95%;
      margin: 0 auto;
      left: 0;
      right: 0;
    }

    .snackbar-text {
      padding: 0 4px  0 8px;
    }

    .snackbar-action {
      flex-grow: 1;
      padding-left: 4px;
      text-align: right;
    }

    button {
      margin: 2px;
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
