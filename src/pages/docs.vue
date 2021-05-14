<template>
	<div class="lg:flex mx-auto w-full max-w-screen-2xl">
		<Sidebar v-if="docs" />
		<router-view v-if="docs" :key="$route.path" />
		<Spinner v-else />
	</div>
</template>

<script setup lang="ts">
import { reactive, computed, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '~/store';

import MainSource from '~/data/MainSource';
import CollectionSource from '~/data/CollectionSource';
import CommandoSource from '~/data/CommandoSource';
import RPCSource from '~/data/RPCSource';
import DocsSource from '~/data/DocsSource';

import Sidebar from '~/components/Sidebar.vue';
import Spinner from '~/components/Spinner.vue';

const router = useRouter();
const route = useRoute();
const store = useStore();

const sources = reactive({
	[MainSource.id]: MainSource,
	[CollectionSource.id]: CollectionSource,
	[CommandoSource.id]: CommandoSource,
	[RPCSource.id]: RPCSource,
});

const source = computed(() => store.state.source);
const tag = computed(() => store.state.tag);
const docs = computed(() => store.state.docs);

const fetchDocs = async (inputSource: DocsSource, inputTag: string) => {
	const documentation = await inputSource.fetchDocs(inputTag);

	// Sort everything
	documentation.classes.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
	documentation.typedefs.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
	for (const c of documentation.classes) {
		if (c.props) {
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
		symbol: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol',
		void: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined',
		Object: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
		Function: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function',
		function: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function',
		Array: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
		Set: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set',
		Map: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
		Date: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
		RegExp: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp',
		Promise: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
		Error: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
		EventEmitter: 'https://nodejs.org/dist/latest/docs/api/events.html#events_class_eventemitter',
		Timeout: 'https://nodejs.org/dist/latest/docs/api/timers.html#timers_class_timeout',
		Immediate: 'https://nodejs.org/dist/latest/docs/api/timers.html#timers_class_immediate',
		Buffer: 'https://nodejs.org/dist/latest/docs/api/buffer.html#buffer_class_buffer',
		ReadableStream: 'https://nodejs.org/dist/latest/docs/api/stream.html#stream_class_stream_readable',
		ChildProcess: 'https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_class_childprocess',
		Worker: 'https://nodejs.org/api/worker_threads.html#worker_threads_class_worker',
		MessagePort: 'https://nodejs.org/api/worker_threads.html#worker_threads_class_messageport',
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
	if (source.value?.id === 'commando') {
		documentation.links.Message = {
			name: 'docs-source-tag-class-class',
			params: { source: 'main', tag: 'master', class: 'Message' },
		};
	}

	documentation.global = source.value?.global;
	documentation.source = source.value?.source;
	documentation.id = source.value?.id;
	documentation.tag = inputTag;

	store.commit({
		type: 'setDocs',
		docs: documentation,
	});
};

const watchRoute = async () => {
	if (route.path === '/') return;
	if (
		route.params.source &&
		route.params.tag &&
		// @ts-ignore
		(docs.value?.id !== sources[route.params.source].id || docs.value?.tag !== route.params.tag)
	) {
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		await fetchDocs(sources[route.params.source] ?? MainSource, route.params.tag ?? tag.value);
	}

	// @ts-ignore
	if (route.params.source && sources[route.params.source]) {
		store.commit({
			type: 'setSource',
			// @ts-ignore
			source: sources[route.params.source],
		});
	} else {
		return router.replace({
			name: 'docs-source-tag-category-file',
			params: {
				source: MainSource.id,
				tag: MainSource.defaultTag,
				category: MainSource.defaultFile.category,
				file: MainSource.defaultFile.id,
			},
		});
	}

	// Set the tag, or redirect to a default route
	if (route.params.tag) {
		store.commit({
			type: 'setTag',
			tag: route.params.tag,
		});
		store.commit({
			type: 'setSource',
			source: {
				// @ts-ignore
				...sources[route.params.source],
				recentTag: route.params.tag,
			},
		});
	} else {
		return router.replace({
			name: 'docs-source-tag-category-file',
			params: {
				source: source.value?.id ?? MainSource.id,
				tag: source.value?.recentTag || source.value?.defaultTag,
				category: source.value?.defaultFile.category ?? MainSource.defaultFile.category,
				file: source.value?.defaultFile.id ?? MainSource.defaultFile.id,
			},
		});
	}

	// Redirect to a default route
	if (!route.params.file && !route.params.class && !route.params.typedef && route.name !== 'docs-search') {
		return router.replace({
			name: 'docs-source-tag-category-file',
			params: {
				source: source.value?.id ?? MainSource.id,
				tag: tag.value ?? MainSource.defaultTag,
				category: source.value?.defaultFile.category ?? MainSource.defaultFile.category,
				file: source.value?.defaultFile.id ?? MainSource.defaultFile.id,
			},
		});
	}
};

watchEffect(() => void watchRoute());
</script>
