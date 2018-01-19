import semver from 'semver';
import DocsSource from './DocsSource';

export default new DocsSource({
  id: 'rpc',
  name: 'RPC',
  global: 'RPC',
  repo: 'discordjs/RPC',
  defaultTag: 'master',
  branchFilter: branch => branch !== 'docs' && !branch.includes('greenkeeper'),
  tagFilter: tag => semver.gte(tag.replace(/^v/, ''), '3.0.0'),
});
