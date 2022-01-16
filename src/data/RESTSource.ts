import semver from 'semver';

import DocsSource from './DocsSource';

const branchBlacklist = new Set(['docs']);
export default new DocsSource({
	id: 'rest',
	name: 'REST',
	global: 'REST',
	docsRepo: 'discordjs/docs',
	repo: 'discordjs/discord.js-modules',
	defaultTag: 'stable',
	branchFilter: (branch: string) => !branchBlacklist.has(branch) && !branch.startsWith('dependabot/'),
	tagFilter: (tag: string) => semver.gt(tag.replace(/^v/, ''), '0.2.0'),
});
