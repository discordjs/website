<template>
  <div class="indexView">
    <slide id="jumbotron">
      <h1><img src="../assets/logo-smaller.png" alt="discord.js" id="logo" /></h1>
      <code class="bash">npm install --save discord.js</code>
      <!--<github-star></github-star>-->
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
      <code class="js">
        const Discord = require("discord.js");<br />
        const client = new Discord.Client();<br />
        <br />
        client.on('ready', () => {<br />
          <pre>  </pre>console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);<br />
        });<br />
        <br />
        client.on('message', msg => {<br />
          <pre>  </pre>if (msg.content == 'ping') msg.reply('Pong!');<br />
        });<br />
        <br />
        client.login('some cool token');
      </code>
    </slide>
  </div>
</template>

<script>
export default {
  ready() {
    window.hljs.highlightBlock(document.querySelector('#jumbotron code'));
    window.hljs.highlightBlock(document.querySelector('#example code'));
  },
};
</script>
