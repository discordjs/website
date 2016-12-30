import semver from 'semver';
import DocsSource from './DocsSource';

const branchBlacklist = new Set(['gh-pages', 'gh-pages-dev', 'docs', 'webpack', 'indev-old', 'v8']);
export default new DocsSource({
  id: 'main',
  name: 'Main library',
  global: 'Discord',
  repo: 'hydrabolt/discord.js',
  defaultTag: 'stable',
  branchFilter: branch => !branchBlacklist.has(branch),
  tagFilter: tag => semver.gte(tag.replace(/^v/, ''), '9.0.0'),
});
