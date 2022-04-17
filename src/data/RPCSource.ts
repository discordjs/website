import semver from 'semver';

import DocsSource, { json } from './DocsSource';

class RPCSource extends DocsSource {
	public override async fetchDocs(tag: string) {
		const res = await fetch(`https://raw.githubusercontent.com/${this.repo}/docs/${tag}.json`);
		return json(res);
	}
}

export default new RPCSource({
	id: 'rpc',
	name: 'RPC',
	global: 'RPC',
	docsRepo: 'discordjs/RPC',
	repo: 'discordjs/RPC',
	defaultTag: 'master',
	branchFilter: (branch: string) => branch !== 'docs' && !branch.includes('greenkeeper'),
	tagFilter: (tag: string) => semver.gte(tag.replace(/(^@.*\/.*@v?)?(?<semver>\d+.\d+.\d+)-?.*/, '$<semver>'), '3.0.0'),
});
