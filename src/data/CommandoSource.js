import semver from 'semver';
import DocsSource from './DocsSource';

const branchBlacklist = new Set(['gh-pages', 'docs']);
export default new DocsSource({
  id: 'commando',
  name: 'Commando',
  global: 'Commando',
  repo: 'Gawdl3y/discord.js-commando',
  branchFilter: branch => !branchBlacklist.has(branch),
  tagFilter: tag => semver.gt(tag.replace(/^v/, ''), '0.4.1'),
});
