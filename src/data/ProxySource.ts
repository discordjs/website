import DocsSource from './DocsSource';

const branchBlacklist = new Set(['docs', 'v8', 'v11', 'v12', 'v13']);
export default new DocsSource({
	id: 'proxy',
	name: 'proxy',
	global: 'proxy',
	docsRepo: 'discordjs/docs',
	repo: 'discordjs/discord.js',
	branchFilter: (branch: string) => !branchBlacklist.has(branch) && !branch.startsWith('dependabot/'),
});
