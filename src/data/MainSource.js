import semver from 'semver';
import DocsSource from './DocsSource';

const branchBlacklist = new Set(['docs', 'webpack', 'v8']);
export default new DocsSource({
  id: 'main',
<<<<<<< HEAD
  name: 'Main library',
  global: 'Discord',
  repo: 'discordjs/discord.js',
=======
  name: '메인 라이브러리',
  global: 'Discord',
  repo: 'discordjs-kr/discord.js',
>>>>>>> Added ALL
  defaultTag: 'stable',
  branchFilter: branch => !branchBlacklist.has(branch) && !branch.startsWith('dependabot/'),
  tagFilter: tag => semver.gte(tag, '9.0.0'),
});
