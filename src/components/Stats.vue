<template>
  <ul class="stats">
    <li>{{ downloads }} downloads</li>
    <li>{{ stars }} stars</li>
    <li>{{ contributors }} contributors</li>
  </ul>
</template>

<script>
  import request from 'superagent/superagent';

  const data = {
    downloads: '175,000+',
    stars: '1,200+',
    contributors: '98+',
    fetching: false,
  };

  export default {
    name: 'stats',

    data() {
      if (data.fetching) return data;
      data.fetching = true;

      request.get('https://api.npmjs.org/downloads/range/2013-08-21:2100-08-21/discord.js').end((err, res) => {
        if (err) return;
        data.downloads = 0;
        for (const item of res.body.downloads) data.downloads += item.downloads;
        data.downloads = data.downloads.toLocaleString();
      });
      request.get('https://api.github.com/repos/hydrabolt/discord.js').end((err, res) => {
        if (!err) data.stars = res.body.stargazers_count.toLocaleString();
      });
      request.get('https://api.github.com/repos/hydrabolt/discord.js/stats/contributors').end((err, res) => {
        if (!err) data.contributors = res.body.length.toLocaleString();
      });

      return data;
    },
  };
</script>
