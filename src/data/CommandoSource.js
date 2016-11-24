const request = require('superagent');
const semver = require('semver');

export default {
  id: 'commando',
  name: 'Commando',
  defaultTag: 'master',
  defaultFile: { category: 'general', id: 'welcome' },
  source: 'https://github.com/Gawdl3y/discord.js-commando/blob/',
  blacklist: new Set(['gh-pages', 'docs']),
  tags: null,

  fetchTags() {
    if (this.tags) return Promise.resolve(this.tags);
    return Promise.all([
      request.get('https://api.github.com/repos/Gawdl3y/discord.js-commando/branches'),
      request.get('https://api.github.com/repos/Gawdl3y/discord.js-commando/tags'),
    ]).then(responses => {
      const branches = responses[0].body;
      const tags = responses[1].body;
      this.tags = ['master'];

      for (const branch of branches) {
        if (branch.name !== 'master' && !this.blacklist.has(branch.name)) this.tags.push(branch.name);
      }

      for (const tag of tags) {
        const version = tag.name.replace(/^v/, '');
        if (semver.gt(version, '0.4.1')) this.tags.push(tag.name);
      }

      return this.tags;
    });
  },

  fetchDocs(tag) {
    return request.get(`https://raw.githubusercontent.com/Gawdl3y/discord.js-commando/docs/${tag}.json`).then(res =>
      JSON.parse(res.text)
    );
  },
};
