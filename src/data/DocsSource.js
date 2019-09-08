import semver from 'semver';

const json = res => {
  if (!res.ok) throw new Error('Failed to fetch docs data file from GitHub');
  return res.json();
};

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
      fetch(`https://api.github.com/repos/${this.repo}/branches`).then(json),
      fetch(`https://api.github.com/repos/${this.repo}/tags`).then(json),
    ]).catch(err => {
      if (localStorage[`source-${this.id}`]) {
        console.error(err);
        const cache = JSON.parse(localStorage[`source-${this.id}`]);
        return [cache.branches, cache.tags];
      }
      throw err;
    }).then(data => {
      const [branches, tags] = data;
      this.tags = [this.defaultTag];
      localStorage[`source-${this.id}`] = JSON.stringify({ branches, tags });

      for (const branch of branches) {
        if (branch.name !== this.defaultTag && this.branchFilter(branch.name)) this.tags.push(branch.name);
      }

      // Build a list of the latest patch versions
      const latestPatches = {};
      for (const tag of tags) {
        if (semver.valid(tag.name)) {
          const majorMinor = `${semver.major(tag.name)}.${semver.minor(tag.name)}`;
          const patch = semver.patch(tag.name);
          if (patch < latestPatches[majorMinor]) continue;
          latestPatches[majorMinor] = patch;
        }
      }

      // Build the list of tags
      for (const tag of tags) {
        if (tag.name === this.defaultTag) continue;
        if (!this.tagFilter(tag.name)) continue;

        // Make sure the tag is the latest patch version
        if (semver.valid(tag.name)) {
          const majorMinor = `${semver.major(tag.name)}.${semver.minor(tag.name)}`;
          const patch = semver.patch(tag.name);
          if (patch < latestPatches[majorMinor]) continue;
        }

        this.tags.push(tag.name);
      }

      return this.tags;
    });
  }

  fetchDocs(tag) {
    return fetch(`https://raw.githubusercontent.com/${this.repo}/docs/${tag}.json`).then(json);
  }
}
