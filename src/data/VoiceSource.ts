import semver from 'semver';

import DocsSource from './DocsSource';

const branchBlacklist = new Set(['docs']);
export default new DocsSource({
	id: 'voice',
	name: 'Voice',
	global: 'Voice',
	repo: 'discordjs/voice',
	defaultTag: 'stable',
	branchFilter: (branch: string) => !branchBlacklist.has(branch) && !branch.startsWith('dependabot/'),
	tagFilter: (tag: string) => semver.gte(tag.replace(/^v/, ''), '0.7.0'),
});
