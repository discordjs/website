import semver from 'semver';
import DocsSource from './DocsSource';

export default new DocsSource({
	id: 'discord.js',
	name: 'discord.js',
	global: 'discord.js',
	docsRepo: 'discordjs/docs',
	repo: 'discordjs/discord.js',
	branchFilter: (branch) => branch === "main" || /^v1[3-9]$/.test(branch),
	tagFilter: (tag: string) => semver.gte(tag.replace(/(^@.*\/.*@v?)?(?<semver>\d+.\d+.\d+)-?.*/, '$<semver>'), '9.0.0'),
});
