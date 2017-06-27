<template>
  <div id="home" v-once>
    <slide id="jumbotron">
      <logo :light="true" id="logo" />
      <code>npm install --save discord.js</code><br />
    </slide>

    <section id="info">
      <div class="info-item">
        <h2>About</h2>
        <p>
          discord.js is a powerful <a href="https://nodejs.org/">node.js</a> module that allows you to interact with the
          <a href="https://discordapp.com/developers/docs/intro">Discord API</a> very easily.
          It takes a much more object-oriented approach than most other JS Discord libraries, making your bot's code significantly tidier and easier to comprehend.
        </p>
        <p>
          Usability, consistency, and performance are key focuses of discord.js, and it also has nearly 100% coverage of the Discord API.
          It receives new Discord features shortly after they arrive in the API.
        </p>
      </div>

      <div class="info-item">
        <h2>Example</h2>
        <pre><code class="javascript" v-hljs>
const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login('token');
        </code></pre>
      </div>

      <div class="info-item">
        <h2>Why?</h2>
        <p>
          <ul>
            <li>Object-oriented</li>
            <li>Speedy and efficient</li>
            <li>Feature-rich</li>
            <li>Flexible</li>
            <li>100% Promise-based</li>
          </ul>
        </p>
      </div>

      <div class="info-item">
        <h2>Statistics</h2>
        <p>
          <stats />
        </p>
        <p class="center">...and growing!</p>
      </div>

      <div class="full-info-item">
        <router-link to="/docs" class="big-ass-btn">Get started</router-link>
        <a href="https://discord.gg/bRCvFy9" class="big-ass-btn discord">Discord</a>
      </div>
    </section>
  </div>
</template>

<script>
  import Logo from '../Logo.vue';
  import Stats from '../Stats.vue';
  import Konami from 'konami-code-js';

  let konami = null;

  export default {
    name: 'home',
    components: {
      Logo,
      Stats,
    },

    mounted() {
      if (!konami) {
        konami = new Konami(() => {
          document.getElementById('logo').style.animation = 'spin 0.5s infinite linear';
          konami.disable();
        });
      } else {
        konami.enable();
      }
    },

    beforeDestroy() {
      if (konami) konami.disable();
    },
  };
</script>

<style lang="scss">
  @import '../../styles/theming';
  @import '../../styles/mq';

  #home {
    text-align: center;
    background: #fefefe;

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

  	code {
  		display: inline-block;
  		padding: 16px;
  		border-radius: 5px;
  		background: #f5f5f5;
  		font-family: $font-monospace;
  		color: black;
  	}

    #jumbotron {
      flex: 0 0 100%;
      padding: 80px 16px;
      background-color: $color-primary;
      background-image: linear-gradient(top, $color-primary, darken($color-primary, 5%));
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

      code {
        text-align: left;
        font-size: 0.875rem;
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
</style>
