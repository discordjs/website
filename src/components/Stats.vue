<template>
  <ul class="stats">
    <li>{{ downloads }} downloads</li>
    <li>{{ stars }} stars</li>
    <li>{{ contributors }} contributors</li>
  </ul>
</template>

<script>
const json = res => res.json();
const noop = () => {
  // Do nothing.
};
const data = {
  downloads: `${(2800000).toLocaleString()}+`,
  stars: `${(4300).toLocaleString()}+`,
  contributors: '100+',
  fetching: false,
};

export default {
  name: 'stats',

  data() {
    return data;
  },

  beforeMount() {
    this.fetch();
  },

  methods: {
    async fetch() {
      if (this.fetching) return;
      this.fetching = true;

      const [downloads, stars, contributors] = await Promise.all([
        fetch('https://api.npmjs.org/downloads/range/2013-08-21:2100-08-21/discord.js').then(json, noop),
        fetch('https://api.github.com/repos/discordjs/discord.js').then(json, noop),
        fetch('https://api.github.com/repos/discordjs/discord.js/stats/contributors').then(json, noop),
      ]);

      if (downloads) {
        this.downloads = 0;
        for (const item of downloads.downloads) this.downloads += item.downloads;
        this.downloads = this.downloads.toLocaleString();
      }
      if (stars) this.stars = stars.stargazers_count.toLocaleString();
      if (contributors) this.contributors = contributors.length.toLocaleString();
    },
  },
};
</script>
