/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import DocsSource from './data/DocsSource';
import MainSource from './data/MainSource';
import { Documentation, DocumentationCustomFile } from './interfaces/Documentation';
import { fetchError } from './util/fetchError';
import { SearchTerm, DocumentType, DocumentLink } from './util/search';
import { splitName } from './util/splitName';
import BuildersSource from '~/data/BuildersSource';
import CollectionSource from '~/data/CollectionSource';
// import CommandoSource from '~/data/CommandoSource';
import RESTSource from '~/data/RESTSource';
import RPCSource from '~/data/RPCSource';
import VoiceSource from '~/data/VoiceSource';

export interface State {
	sources: { source: DocsSource; name: string; id: string }[];
	source: DocsSource | null;
	tag: string | null;
	docs: Documentation | null;
	branches: string[];
	file: DocumentationCustomFile | null;
	stats: {
		downloads: string;
		stars: string;
		contributors: string;
	};
	searchIndex: SearchTerm[];
	searchRef: DocumentLink[];
}

export const key: InjectionKey<Store<State>> = Symbol('docs');

export const store = createStore<State>({
	state: {
		sources: [
			{ source: MainSource, name: MainSource.name, id: MainSource.id },
			{ source: CollectionSource, name: CollectionSource.name, id: CollectionSource.id },
			{ source: BuildersSource, name: BuildersSource.name, id: BuildersSource.id },
			{ source: VoiceSource, name: VoiceSource.name, id: VoiceSource.id },
			{ source: RESTSource, name: RESTSource.name, id: RESTSource.id },
			// { source: CommandoSource, name: CommandoSource.name, id: CommandoSource.id },
			{ source: RPCSource, name: RPCSource.name, id: RPCSource.id },
		],
		source: MainSource,
		tag: MainSource.defaultTag,
		docs: null,
		branches: [],
		file: null,
		stats: {
			downloads: `${(225_000_000).toLocaleString()}+`,
			stars: `${(11_000).toLocaleString()}+`,
			contributors: `${(100).toLocaleString()}+`,
		},
		searchIndex: [],
		searchRef: [],
	},
	mutations: {
		setSource(state, { source }: { source: DocsSource }) {
			state.source = source;
		},
		setTag(state, { tag }: { tag: string }) {
			state.tag = tag;
		},
		setDocs(state, { docs }: { docs: any }) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			state.docs = docs;
		},
		setBranches(state, { branches }: { branches: string[] }) {
			state.branches = branches;
		},
		setFile(state, { file }: { file: any }) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			state.file = file;
		},
		setStats(state, { stats }: { stats: { downloads: string; stars: string; contributors: string } }) {
			state.stats = stats;
		},
		setSearchIndex(state, { searchIndex, searchRef }: { searchIndex: SearchTerm[]; searchRef: DocumentLink[] }) {
			state.searchIndex = searchIndex;
			state.searchRef = searchRef;
		},
	},
	actions: {
		fetchStats: async ({ commit }) => {
			let downloads = 0;
			let stars = 0;
			let contributors = 0;

			const toJSON = (res: Response) => res.json();
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const noop = () => {};

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const [fetchedDownloads, fetchedStars, fetchedContributors] = await Promise.all([
				fetch('https://api.npmjs.org/downloads/range/2013-08-21:2100-08-21/discord.js').then(toJSON, noop),
				fetch('https://api.github.com/repos/discordjs/discord.js').then(toJSON, noop),
				fetch('https://api.github.com/repos/discordjs/discord.js/stats/contributors').then(toJSON, noop),
			]);

			if (fetchedDownloads?.downloads) {
				downloads = 0;

				for (const item of fetchedDownloads.downloads) {
					downloads += item.downloads;
				}
			}
			if (fetchedStars?.stargazers_count) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				stars = fetchedStars.stargazers_count;
			}
			if (fetchedContributors) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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

		/**
		 * Idea: inverted index based on the understanding that all the names here are some sort of concatenated string
		 * Generate a graph of words that are related
		 * e.g. indexing on [PermissionOverwriteOptions, PermissionResolvable, setPermissions] generates something like this
		 * Original reference: [
		 * 	 PermissionOverwriteOptions,
		 *   PermissionResolvable,
		 *   setPermissions,
		 *  ]
		 * Index: [
		 *   {name: permission, related: [1, 2]},
		 *   {name: overwrite, related: [1]},
		 *   {name: options, related: [1]},
		 *   {name: permissions, related: [3]},
		 *   {name: set, related: [3]},
		 * ]
		 *
		 * Iterate through the list seeing if any of the terms are in the search query, then sum the counts of each related index
		 * The higher the count the more close of a match it should be
		 * If all else is equal, sort based on how closely it matches the original input
		 *
		 * Should the initial search return nothing, that might mean the length is too short
		 * So we'll do the opposite, see if the query is in any of the terms. e.g. mission should find permission
		 * This can be a shallow scan which should be fairly fast.
		 */

		fetchDocs: async (
			{ commit },
			{ inputSource, inputTag = inputSource.defaultTag }: { inputSource: DocsSource; inputTag?: string },
		) => {
			let documentation: any;
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				documentation = await inputSource.fetchDocs(inputTag);
			} catch (error) {
				commit({
					type: 'setDocs',
					docs: null,
				});

				commit({
					type: 'setTag',
					docs: null,
				});

				// @ts-expect-error
				fetchError.value = error;

				return;
			}

			const originalRef: DocumentLink[] = [];
			const searchIndex: SearchTerm[] = [];

			let linkPosition = 0; // This is for class refs adding refs to their methods and props
			const addLink = (
				name: string,
				linkType: DocumentType,
				parentName?: string,
				parentType?: DocumentType,
				access?: string,
				scope?: string,
			): number[] => {
				const words = splitName(name);
				const docLink = new DocumentLink(name, linkType, parentName, parentType, access, scope);
				originalRef.push(docLink);

				const addedRefs = [];
				for (const w of words) {
					const word = w.toLowerCase();
					let refIndex = searchIndex.findIndex((s) => s.name === word);
					if (refIndex > -1) {
						searchIndex[refIndex].addRelated(linkPosition);
					} else {
						refIndex = searchIndex.push(new SearchTerm(word, linkPosition)) - 1;
					}
					addedRefs.push(refIndex);
				}
				linkPosition += 1;

				return addedRefs;
			};

			for (const item of documentation.classes) {
				const classref = addLink(item.name, DocumentType.Class, undefined, undefined, item.access, item.scope);

				const subRefs: number[] = [];

				for (const m of item.methods ?? []) {
					addLink(m.name as string, DocumentType.Method, item.name, DocumentType.Class, m.access, m.scope);
					subRefs.push(linkPosition - 1);
				}

				for (const p of item.props ?? []) {
					addLink(p.name, DocumentType.Property, item.name, DocumentType.Class, p.access, p.scope);
					subRefs.push(linkPosition - 1);
				}

				for (const e of item.events ?? []) {
					addLink(e.name, DocumentType.Events, item.name, DocumentType.Class, e.access, e.scope);
					subRefs.push(linkPosition - 1);
				}
				for (const ref of classref) {
					for (const r of subRefs) {
						searchIndex[ref].related.add(r);
					}
				}
			}

			for (const item of documentation.typedefs) {
				const classref = addLink(item.name, DocumentType.Typedefs, undefined, undefined, item.access, item.scope);

				const subRefs: number[] = [];
				for (const p of item.props ?? []) {
					addLink(p.name, DocumentType.Property, item.name, DocumentType.Typedefs, p.access, p.scope);
					subRefs.push(linkPosition - 1);
				}
				for (const ref of classref) {
					for (const r of subRefs) {
						searchIndex[ref].related.add(r);
					}
				}
			}

			commit({
				type: 'setSearchIndex',
				searchIndex,
				searchRef: originalRef,
			});

			// Sort everything
			documentation.classes.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
			documentation.typedefs.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
			for (const c of documentation.classes) {
				if (c.props) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
					c.props.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
				}

				if (c.methods) {
					c.methods.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
				}

				if (c.events) {
					c.events.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
				}
			}

			// Built-in type links
			documentation.links = {
				string: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
				number: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
				bigint: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt',
				boolean: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
				true: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
				false: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
				symbol: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol',
				void: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined',
				undefined: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined',
				null: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null',
				Object: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
				object: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
				Function: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function',
				function: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function',
				Array: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
				Set: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set',
				Map: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
				Date: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
				RegExp: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp',
				Promise: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
				Error: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',

				// Node
				EventEmitter: 'https://nodejs.org/dist/latest/docs/api/events.html#events_class_eventemitter',
				Timeout: 'https://nodejs.org/dist/latest/docs/api/timers.html#timers_class_timeout',
				Immediate: 'https://nodejs.org/dist/latest/docs/api/timers.html#timers_class_immediate',
				Buffer: 'https://nodejs.org/dist/latest/docs/api/buffer.html#buffer_class_buffer',
				ReadableStream: 'https://nodejs.org/dist/latest/docs/api/stream.html#stream_class_stream_readable',
				ChildProcess: 'https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_class_childprocess',
				Worker: 'https://nodejs.org/api/worker_threads.html#worker_threads_class_worker',
				MessagePort: 'https://nodejs.org/api/worker_threads.html#worker_threads_class_messageport',

				// TypeScript
				any: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any',
				unknown: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown',
				readonly: 'https://www.typescriptlang.org/docs/handbook/2/classes.html#readonly',
				Record: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type',
				Exclude: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion',
				Omit: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys',
				IterableIterator: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols',
			};

			// Add links for everything
			documentation.externals = documentation.externals || [];
			documentation.classes = documentation.classes || [];
			documentation.typedefs = documentation.typedefs || [];
			for (const x of documentation.externals) {
				documentation.links[x.name] = x.see[0].replace(/\{@link\s+(.+?)\s*\}/i, '$1');
			}
			for (const c of documentation.classes) {
				documentation.links[c.name] = { name: 'docs-source-tag-class-class', params: { class: c.name } };
			}
			for (const t of documentation.typedefs) {
				documentation.links[t.name] = { name: 'docs-source-tag-typedef-typedef', params: { typedef: t.name } };
			}

			// Workaround for the single use of inter-source see also linking
			if (inputSource.id === 'commando') {
				documentation.links.Message = {
					name: 'docs-source-tag-class-class',
					params: { source: 'main', tag: 'master', class: 'Message' },
				};
			}

			documentation.global = inputSource.global;
			documentation.source = inputSource.source;
			documentation.id = inputSource.id;
			documentation.tag = inputTag;

			commit({
				type: 'setDocs',
				docs: documentation,
			});
		},

		fetchTags: async ({ commit }, { currentSource }: { currentSource: DocsSource }) => {
			const tags = await currentSource.fetchTags();

			commit({
				type: 'setBranches',
				branches: tags,
			});
		},
	},
});

export function useStore() {
	return baseUseStore(key);
}
