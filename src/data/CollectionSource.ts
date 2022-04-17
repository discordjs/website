import semver from 'semver';

import DocsSource from './DocsSource';

const branchBlacklist = new Set(['docs', 'v8', 'v11', 'v12', 'v13']);
export default new DocsSource({
	id: 'collection',
	name: 'Collection',
	global: 'Collection',
	docsRepo: 'discordjs/docs',
	repo: 'discordjs/discord.js',
	defaultTag: 'stable',
	branchFilter: (branch: string) => !branchBlacklist.has(branch) && !branch.startsWith('dependabot/'),
	tagFilter: (tag: string) =>
		tag.includes('@discordjs/collection') &&
		semver.gte(tag.replace(/(^@.*\/.*@v?)?(?<semver>\d+.\d+.\d+)-?.*/, '$<semver>'), '0.3.1'),
});
