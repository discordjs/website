<template>
  <div id="home">
    <slide id="jumbotron">
      <logo :light="true" :konami="konami" id="logo" />
      <code>npm install discord.js</code><br />
    </slide>

    <section id="info">
      <div class="info-item">
        <h2>대하여</h2>
        <p>
          discord.js 는 강력한 <a href="https://nodejs.org/">node.js</a> 모듈로써 <a href="https://discordapp.com/developers/docs/intro">디스코드 API</a>와 쉽게 상호작용하게 해줍니다.
          이 라이브러리는 봇의 코드를 상당히 정돈되고 더 쉽게, 그리고 대부분의 자바스크립트 디스코드 라이브러리들보다 훨씬 더 객체 지향적입니다.
        </p>
        <p>
          유용함, 일관성, 성능은 discord.js 의 주요 초점이며, Discord API를 거의 100% 다룰 수 있습니다.
          또한, 새로운 디스코드 기능은 디스코드 API에 적용되면, 빠르게 업데이트됩니다.
        </p>
      </div>

      <div class="info-item">
        <h2>예시</h2>
        <pre><code class="javascript" v-hljs>const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`${client.user.tag}에 로그인하였습니다!`);
});

client.on('message', msg => {
  if (msg.content === '핑') {
    msg.reply('퐁!');
  }
});

client.login('토큰');</code></pre>
      </div>

      <div class="info-item">
        <h2>왜 써야하나요?</h2>
        <p>
          <ul>
            <li>객체 지향적</li>
            <li>빠르고 효율적</li>
            <li>풍푸한 기능</li>
            <li>유연한</li>
            <li>100% 프로미스 기반</li>
          </ul>
        </p>
      </div>

      <div class="info-item">
        <h2>통계</h2>
        <p>
          <stats />
        </p>
        <p class="center">...그리고 성장중!</p>
      </div>

      <div class="full-info-item">
        <router-link to="/docs" class="big-ass-btn">시작하기</router-link>
        <a href="https://discord.gg/bRCvFy9" class="big-ass-btn discord">디스코드(영어)</a>
      </div>
    </section>
  </div>
</template>

<script>
import Logo from '../Logo.vue';
import Stats from '../Stats.vue';
import MainSource from '../../data/MainSource';

export default {
  name: 'home',
  props: ['konami'],
  components: {
    Logo,
    Stats,
  },

  mounted() {
    this.$emit('setRepository', MainSource.repo);
  },
};
</script>

<style lang="scss">
  @import '../../styles/theming';
  @import '../../styles/mq';

  #home {
    text-align: center;
    background: $color-content-bg;
    color: $color-content-text;

    h2 {
      font-size: 2rem;
      margin: 0;
      font-weight: 600;
      letter-spacing: -1px;
    }

    p {
      font-size: 1rem;
      line-height: 2rem;
      text-align: left;

      @include mq($until: tablet) {
        margin: 0 1rem;
      }

      & > a {
        font-weight: bold;
      }

      &.center {
        text-align: center;
      }
    }

    #jumbotron {
      flex: 0 0 100%;
      padding: 80px 16px;
      background-color: $color-primary;
      background-image: linear-gradient(top, $color-primary, darken($color-primary, 5%));

      code {
        display: inline-block;
        padding: 16px;
        border-radius: 5px;
        background: #f5f5f5;
        color: $color-content-text;
        font-family: $font-monospace;
      }
    }

    #logo {
      display: block;
      margin: 16px auto;
      width: 95%;
      max-width: 700px;
      overflow: visible;
      filter: drop-shadow(0 3px 4px #333);
    }

    #info {
      display: flex;
      flex-flow: row wrap;
      margin: 64px auto 0 auto;
      max-width: 1120px;

      @include mq($until: tablet) {
        margin: 32px auto 0 auto;
      }
    }

    .info-item {
      flex: 1 1 45%;
      padding: 24px;

      ul {
        display: inline-block;
        margin: 0 auto;
        text-align: left;
      }

      pre {
        padding: 8px;
        border-radius: 4px;
        text-align: left;
        font-size: 0.875rem;
        background: #F0F0F0;
      }
    }

    .full-info-item {
      flex: 1 0 100%;
      margin: 48px 0;
    }

    .big-ass-btn {
      display: inline-block;
      padding: 12px 10px;
      border-radius: 4px;
      background: $color-primary;
      color: white;
      font-size: 1.1rem;

      &:hover {
        background: lighten($color-primary, 10%);
      }

      &:not(:first-of-type) {
        margin-left: 8px;
      }

      &.discord {
        background-color: #7289da;

        &:hover {
          background: lighten(#7289da, 10%);
        }
      }
    }
  }

  #app.dark #home {
    background: $color-content-bg-dark;
    color: $color-content-text-dark;

    pre {
      background: lighten($color-content-bg-dark, 4%);
      color: darken($color-content-text-dark, 20%);
    }
  }
</style>
