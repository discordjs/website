/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import semver from 'semver';

interface DocsSourceOptions {
	id: string;
	name: string;
	global: string;
	docsRepo: string;
	repo: string;
	defaultTag?: string;
	defaultFile?: { category: string; id: string };
	source?: string;
	branchFilter?: (branch: string) => boolean;
	tagFilter?: (tag: string) => boolean;
}

export const json = (res: Response) => {
	if (!res.ok) throw new Error('Failed to fetch docs data file from GitHub');
	return res.json();
};

export default class DocsSource {
	public id = this.options.id;

	public name = this.options.name;

	public global = this.options.global;

	public docsRepo = this.options.docsRepo;

	public repo = this.options.repo;

	public defaultTag = 'main';

	public defaultFile = this.options.defaultFile ?? { category: 'general', id: 'welcome' };

	public source = this.options.source ?? `https://github.com/${this.repo}/blob/`;

	public branchFilter = this.options.branchFilter ?? ((branch: string) => branch !== 'main');

	public tagFilter = this.options.tagFilter ?? (() => true);

	public branches: any[] | null = null;

	public tags: any[] | null = null;

	public recentTag: any = null;

	public constructor(public readonly options: DocsSourceOptions) {}

	public fetchTags() {
		if (this.tags) return Promise.resolve(this.tags);
		return Promise.all([
			fetch(`https://api.github.com/repos/${this.repo}/branches`).then(json),
			fetch(`https://api.github.com/repos/${this.repo}/git/refs/tags`).then(json),
		])
			.catch((err) => {
				if (localStorage[`source-${this.id}`]) {
					console.error(err);
					const cache = JSON.parse(localStorage[`source-${this.id}`]);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return [cache.branches, cache.tags];
				}
				throw err;
			})
			.then((data) => {
				const [branches, tags] = data;
				this.tags = [];
				this.branches = [];
				localStorage[`source-${this.id}`] = JSON.stringify({ branches, tags });

				for (const branch of branches) {
					if (this.branchFilter(branch.name)) {
						this.branches.push(branch.name);
					}
				}

				// Build a list of the latest patch versions
				const latestPatches: { [key: string]: number } = {};
				for (const tag of tags) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					tag.name = tag.ref.replace('refs/tags/', '');
					if (semver.valid(tag.name)) {
						const majorMinor = `${semver.major(tag.name)}.${semver.minor(tag.name)}`;
						const patch = semver.patch(tag.name);
						if (patch < latestPatches[majorMinor]) {
							continue;
						}
						latestPatches[majorMinor] = patch;
					}
				}

				// Build the list of tags
				for (const tag of tags) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					tag.name = tag.ref.replace('refs/tags/', '');
					if (!this.tagFilter(tag.name)) {
						continue;
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					tag.name = tag.name.replace(/(^@.*\/.*@v?)?(?<semver>\d+.\d+.\d+)-?.*/, '$<semver>');
					// Make sure the tag is the latest patch version
					if (semver.valid(tag.name)) {
						const majorMinor = `${semver.major(tag.name)}.${semver.minor(tag.name)}`;
						const patch = semver.patch(tag.name);
						if (patch < latestPatches[majorMinor]) {
							continue;
						}
					}

					this.tags.push(tag.name);
				}

				this.tags = [...this.branches, ...this.tags.reverse()];
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return this.tags;
			});
	}

	public async fetchDocs(tag?: string | null) {
		const tags = await this.fetchTags();
		const res = await fetch(`https://docs.discordjs.dev/docs/${this.id}/${tag ?? this.defaultTag}.json`);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return [tags, await json(res)];
	}
}
