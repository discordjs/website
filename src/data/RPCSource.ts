import semver from 'semver';

import DocsSource, { json } from './DocsSource';

class RPCSource extends DocsSource {
	public override async fetchDocs(tag: string) {
		const tags = await this.fetchTags();
		const res = await fetch(`https://raw.githubusercontent.com/${this.docsRepo}/docs/${tag}.json`);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return [tags, await json(res)];
	}
}

export default new RPCSource({
	id: 'rpc',
	name: 'rpc',
	global: 'rpc',
	docsRepo: 'discordjs/RPC',
	repo: 'discordjs/RPC',
	branchFilter: (branch: string) => branch !== 'docs' && !branch.includes('greenkeeper'),
	tagFilter: (tag: string) => semver.gte(tag.replace(/(^@.*\/.*@v?)?(?<semver>\d+.\d+.\d+)-?.*/, '$<semver>'), '3.0.0'),
});
