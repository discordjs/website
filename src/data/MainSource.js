const request = require('superagent');
const semver = require('semver');

export default {
  id: 'main',
  name: 'Main library',
  defaultTag: 'master',
  defaultFile: { category: 'general', name: 'Welcome' },
  source: 'https://github.com/hydrabolt/discord.js/blob/',
  blacklist: new Set(['gh-pages', 'gh-pages-dev', 'docs', 'v8', 'indev-old']),
  tags: null,

  fetchTags() {
    if (this.tags) return Promise.resolve(this.tags);
    return Promise.all([
      request.get('https://api.github.com/repos/hydrabolt/discord.js/branches'),
      request.get('https://api.github.com/repos/hydrabolt/discord.js/tags'),
    ]).then(responses => {
      const branches = responses[0].body;
      const tags = responses[1].body;
      this.tags = ['master'];

      for (const branch of branches) {
        if (branch.name !== 'master' && !this.blacklist.has(branch.name)) this.tags.push(branch.name);
      }

      for (const tag of tags) {
        const name = tag.name.replace(/^v/, '');
        if (semver.gte(name, '9.0.0')) this.tags.push(name);
      }

      return this.tags;
    });
  },

  fetchDocs(tag) {
    return request.get(`https://raw.githubusercontent.com/hydrabolt/discord.js/docs/${tag}.json`).then(res =>
      JSON.parse(res.text)
    );
  },
};
