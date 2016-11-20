<template>
  <div id="home" v-once>
    <slide id="jumbotron">
      <h1><img src="../../assets/logo.png" alt="discord.js" id="logo" /></h1>
      <code>npm install --save discord.js</code>
    </slide>

    <slide id="about">
      <h2>About</h2>
      <p>
        discord.js is a powerful <a href="https://nodejs.org/">node.js</a> module that allows you to interact with the
        <a href="https://discordapp.com/developers/docs/intro">Discord API</a> very easily.
        It takes a much more object-oriented approach than most other JS Discord libraries, making your bot's code significantly tidier and easier to comprehend.
        Usability and performance are key focuses of discord.js, and it also has nearly 100% coverage of the Discord API.
      </p>
    </slide>

    <slide id="example">
      <h2>Example</h2>
      <pre><code class="javascript" v-hljs>
const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
});

client.on('message', msg => {
  if (msg.content === 'ping') msg.reply('Pong!');
});

client.login('some cool token');
      </code></pre>
    </slide>
  </div>
</template>

<script>
  export default { name: 'home' };
</script>

<style lang="scss">
  @import '../../styles/theming';
  @import '../../styles/mq';

  #home {
  	.slide > .container {
  		text-align: center;
  	}

  	h2 {
  		font-size: 2rem;
  		margin: 0;
  	}

  	p {
  		font-size: 1.2rem;
  		line-height: 2rem;

  		@include mq($until: desktop) {
  			margin: 0 1rem;
  		}

  		& > a {
  			font-weight: bold;
  		}
  	}

  	code {
  		display: inline-block;
  		margin: 16px;
  		padding: 16px;
  		border-radius: 5px;
  		background: #fafafa;
  		font-family: $font-monospace;
  		color: black;
  	}

    #jumbotron {
      padding: 100px 16px;
      background-color: $color-primary;
      background-image: linear-gradient(top, $color-primary, darken($color-primary, 5%));

      h1 {
        margin: 0;
        font-size: 4rem;
        text-shadow: 0 3px 0 #555, 0 0 1em black;

        img {
          width: 95%;
          max-width: 700px;
          filter: drop-shadow(2px 2px 2px #222);
        }
      }
    }

    #about, #example {
      @include mq($until: desktop) {
        padding: 32px 0;
      }

      @include mq($from: desktop) {
        padding: 64px 0;
      }
    }

    #about {
      background: #fafafa;
    }

    #example {
      background: #eee;

      code {
        text-align: left;
        font-size: 14px;
        white-space: pre-wrap;
      }
    }
  }
</style>
