import semver from 'semver';

import DocsSource from './DocsSource';

const branchBlacklist = new Set(['stable', 'docs', 'v8', 'v11', 'v12', 'v13']);
export default new DocsSource({
	id: 'voice',
	name: 'voice',
	global: 'voice',
	docsRepo: 'discordjs/docs',
	repo: 'discordjs/discord.js',
	branchFilter: (branch: string) => !branchBlacklist.has(branch) && !branch.startsWith('dependabot/'),
	tagFilter: (tag: string) =>
		tag.includes('@discordjs/voice') &&
		semver.gte(tag.replace(/(^@.*\/.*@v?)?(?<semver>\d+.\d+.\d+)-?.*/, '$<semver>'), '0.7.0'),
});
