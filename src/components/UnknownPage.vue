<template>
  <div>
<<<<<<< HEAD
    <h1>Unknown {{ type || 'page' }}</h1>
    <p>This page doesn't actually exist. Oh no!</p>
    <p>Instead, please accept this exceptionally awesome piece of artwork:</p>
=======
    <h1>알 수 없는 페이지</h1>
    <p>이 페이지는 존재하지 않습니다.</p>
    <p>대신, 이 멋진 작품을 감상해주세요:</p>
>>>>>>> Added ALL
    <p><awesome :light="darkMode" /></p>
  </div>
</template>

<script>
import Awesome from './Awesome.vue';

export default {
  name: 'unknown-page',
  props: ['type', 'darkMode'],
  components: { Awesome },
};
</script>

<style>
  #awesome {
    width: 100%;
    max-width: 476px;
  }
</style>
