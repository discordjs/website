import semver from 'semver';
import DocsSource from './DocsSource';

const branchBlacklist = new Set(['gh-pages', 'docs']);
export default new DocsSource({
  id: 'commando',
  name: 'Commando',
  global: 'Commando',
  repo: 'discordjs/Commando',
  branchFilter: branch => !branchBlacklist.has(branch) && !branch.startsWith('dependabot/'),
  tagFilter: tag => semver.gt(tag.replace(/^v/, ''), '0.4.1'),
});
