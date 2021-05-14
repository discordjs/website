import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

import DocsSource from './data/DocsSource';
import MainSource from './data/MainSource';

import { Documentation, DocumentationCustomFile } from './interfaces/Documentation';

export interface State {
	source: DocsSource | null;
	tag: string | null;
	docs: Documentation | null;
	file: DocumentationCustomFile | null;
	stats: {
		downloads: string;
		stars: string;
		contributors: string;
	};
}

export const key: InjectionKey<Store<State>> = Symbol('docs');

export const store = createStore<State>({
	state: {
		source: MainSource,
		tag: MainSource.defaultTag,
		docs: null,
		file: null,
		stats: {
			downloads: `${(225_000_000).toLocaleString()}+`,
			stars: `${(11_000).toLocaleString()}+`,
			contributors: `${(100).toLocaleString()}+`,
		},
	},
	mutations: {
		setSource(state, { source }: { source: DocsSource }) {
			state.source = source;
		},
		setTag(state, { tag }: { tag: string }) {
			state.tag = tag;
		},
		setDocs(state, { docs }: { docs: any }) {
			state.docs = docs;
		},
		setFile(state, { file }: { file: any }) {
			state.file = file;
		},
		setStats(state, { stats }: { stats: { downloads: string; stars: string; contributors: string } }) {
			state.stats = stats;
		},
	},
	actions: {
		async fetchStats({ commit }) {
			let downloads = 0;
			let stars = 0;
			let contributors = 0;

			const toJSON = (res: Response) => res.json();
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const noop = () => {};

			const [fetchedDownloads, fetchedStars, fetchedContributors] = await Promise.all([
				fetch('https://api.npmjs.org/downloads/range/2013-08-21:2100-08-21/discord.js').then(toJSON, noop),
				fetch('https://api.github.com/repos/discordjs/discord.js').then(toJSON, noop),
				fetch('https://api.github.com/repos/discordjs/discord.js/stats/contributors').then(toJSON, noop),
			]);

			if (fetchedDownloads) {
				downloads = 0;
				for (const item of fetchedDownloads.downloads) {
					downloads += item.downloads;
				}
			}
			if (fetchedStars) {
				stars = fetchedStars.stargazers_count;
			}
			if (fetchedContributors) {
				contributors = fetchedContributors.length;
			}
			commit({
				type: 'setStats',
				stats: {
					downloads: `${downloads.toLocaleString()}+`,
					stars: `${stars.toLocaleString()}+`,
					contributors: `${contributors.toLocaleString()}+`,
				},
			});
		},
	},
});

export function useStore() {
	return baseUseStore(key);
}
