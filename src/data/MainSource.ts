import semver from 'semver';
import DocsSource from './DocsSource';

export default new DocsSource({
	id: 'discord.js',
	name: 'discord.js',
	global: 'discord.js',
	docsRepo: 'discordjs/docs',
	repo: 'discordjs/discord.js',
	branchFilter: (branch) => branch === 'main' || /^v1[3-9]$/.test(branch),
	tagFilter: (tag: string) => {
		const parsed = /(?:^@.*\/(?<package>.*)@v?)?(?<version>\d+.\d+.\d+)-?.*/.exec(tag);
		const parsedPackage = /(?<package>.*)@v?-?.*/.exec(tag);

		if (parsed?.groups) {
			const isSubpackage = typeof parsed.groups.package === 'string';
			const pkg = isSubpackage ? parsed.groups.package : parsedPackage?.groups?.package ?? 'discord.js';
			const { version } = parsed.groups;
			if (pkg === 'discord.js') return semver.gte(version, '12.0.0');
		}

		return false;
	},
});
