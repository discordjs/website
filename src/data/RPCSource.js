import semver from 'semver';
import DocsSource from './DocsSource';

export default new DocsSource({
  id: 'rpc',
  name: 'RPC',
  global: 'RPC',
  repo: 'devsnek/discord-rpc',
  defaultTag: 'master',
  branchFilter: branch => !branch.includes('greenkeeper'),
  tagFilter: tag => semver.gte(tag.replace(/^v/, ''), '3.0.0'),
});
