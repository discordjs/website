import request from 'superagent/superagent';

export default class DocsSource {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.global = options.global;
    this.repo = options.repo;
    this.defaultTag = options.defaultTag || 'master';
    this.defaultFile = options.defaultFile || { category: 'general', id: 'welcome' };
    this.source = options.source || `https://github.com/${this.repo}/blob/`;
    this.branchFilter = options.branchFilter || (branch => branch !== 'master');
    this.tagFilter = options.tagFilter || (() => true);
    this.tags = null;
    this.recentTag = null;
  }

  fetchTags() {
    if (this.tags) return Promise.resolve(this.tags);
    return Promise.all([
      request.get(`https://api.github.com/repos/${this.repo}/branches`),
      request.get(`https://api.github.com/repos/${this.repo}/tags`),
    ]).then(responses => [responses[0].body, responses[1].body], err => {
      if (localStorage[`source-${this.id}`]) {
        console.error(err);
        const cache = JSON.parse(localStorage[`source-${this.id}`]);
        return [cache.branches, cache.tags];
      }
      throw err;
    }).then(data => {
      const branches = data[0];
      const tags = data[1];
      this.tags = [this.defaultTag];
      localStorage[`source-${this.id}`] = JSON.stringify({ branches, tags });

      for (const branch of branches) {
        if (branch.name !== this.defaultTag && this.branchFilter(branch.name)) this.tags.push(branch.name);
      }
      for (const tag of tags) {
        if (tag.name !== this.defaultTag && this.tagFilter(tag.name)) this.tags.push(tag.name);
      }

      return this.tags;
    });
  }

  fetchDocs(tag) {
    return request.get(`https://raw.githubusercontent.com/${this.repo}/docs/${tag}.json`).then(res =>
      JSON.parse(res.text)
    );
  }
}
