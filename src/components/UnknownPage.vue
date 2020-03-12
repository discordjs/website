<template>
  <div>
    <h1>알 수 없는 페이지</h1>
    <p>이 페이지는 존재하지 않습니다.</p>
    <p>대신, 이 멋진 작품을 감상해주세요:</p>
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
