<template>
	<div class="mx-auto py-16 px-4 sm:px-8 lg:py-8 w-full">
		<SourceButton class="float-right mt-2" :meta="cls?.meta" />

		<div class="prose prose-discord dark:prose-light break-words-legacy mx-auto max-w-4xl lg:max-w-full">
			<h1 :id="`doc-for-${cls?.name}`" class="!mb-3">
				{{ cls?.name }}
			</h1>
			<p class="font-bold !mt-3">
				<span v-if="cls?.extends">
					extends
					<TypeLink v-if="typeof cls?.extends[0] === 'string'" :type="typeToArray(cls?.extends)" />
					<Types v-for="type in cls?.extends" v-else :key="typeKey(type)" :names="type" />
				</span>
				<span v-if="cls?.implements">
					implements
					<TypeLink v-if="typeof cls?.implements[0] === 'string'" :type="typeToArray(cls?.implements)" />
					<Types v-for="type in cls?.implements" v-else :key="typeKey(type)" :names="type" />
				</span>
			</p>

			<p v-if="cls?.description" class="!mb-2" v-html="description"></p>

			<div v-if="cls?.construct" class="grid">
				<h2 class="!mt-3">Constructor</h2>
				<pre
					ref="codeblock"
					class="javascript"
				><code>new {{ docs?.global }}.{{ cls?.name }}(<span v-for="(param, idx) in constructorParameters" :key="param.name">{{ param.name }}{{ (constructorParameters?.length ?? 1) - 1 !== idx ? ', ' : '' }}</span>);</code></pre>
				<ParameterTable v-if="cls.construct.params" :parameters="cls.construct.params" />
			</div>

			<ClassOverview class="mt-3" :properties="cls?.props" :methods="cls?.methods" :events="cls?.events" />

			<h2 v-if="properties && properties.length" class="!mt-4">Properties</h2>
			<ClassProperty v-for="property in properties" :key="scopedName(property)" :prop="property" />

			<h2 v-if="methods && methods.length">Methods</h2>
			<ClassMethod v-for="method in methods" :key="scopedName(method)" :method="method" />

			<h2 v-if="cls?.events && cls?.events.length">Events</h2>
			<ClassEvent v-for="event in cls?.events" :key="`e-${event.name}`" :event="event" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import highlight from 'highlight.js';
highlight.configure({ ignoreUnescapedHTML: true });

import { useStore } from '~/store';
import { markdown } from '~/util/markdown';
import { convertLinks } from '~/util/convertLinks';
import { typeKey } from '~/util/typeKey';
import { scopedName } from '~/util/scopedName';

import SourceButton from '~/components/SourceButton.vue';
import TypeLink from '~/components/TypeLink.vue';
import Types from '~/components/Types.vue';
import ParameterTable from '~/components/ParameterTable.vue';
import ClassOverview from '~/components/ClassOverview.vue';
import ClassProperty from '~/components/ClassProperty.vue';
import ClassMethod from '~/components/ClassMethod.vue';
import ClassEvent from '~/components/ClassEvent.vue';
import { isShowPrivates } from '~/util/showPrivates';

const router = useRouter();
const route = useRoute();
const store = useStore();

const codeblock = ref<HTMLPreElement>();

const docs = computed(() => store.state.docs);

const cls = docs.value?.classes.find((cls) => cls.name === route.params.class);

// @ts-expect-error
const description = computed(() => markdown(convertLinks(cls?.description, docs.value, router, route)));
const constructorParameters = computed(() => {
	if (!cls?.construct || !cls.construct.params) {
		return null;
	}
	return cls.construct.params.filter((param) => !param.name.includes('.'));
});
const properties = computed(() => {
	if (!cls?.props) {
		return null;
	}

	let filtered = cls.props;
	if (!isShowPrivates.value) {
		filtered = filtered.filter((prop) => prop.access !== 'private');
	}

	return filtered.sort((a, b) =>
		`${a.scope === 'static' ? 'ZZZ' : ''}${a.name}`.localeCompare(`${b.scope === 'static' ? 'ZZZ' : ''}${b.name}`),
	);
});
const methods = computed(() => {
	if (!cls?.methods) {
		return null;
	}

	let filtered = cls.methods;
	if (!isShowPrivates.value) {
		filtered = filtered.filter((method) => method.access !== 'private');
	}

	return filtered.sort((a, b) =>
		`${a.scope === 'static' ? 'ZZZ' : ''}${a.name}`.localeCompare(`${b.scope === 'static' ? 'ZZZ' : ''}${b.name}`),
	);
});

const typeToArray = (type: any) => type as string[];

onMounted(() => {
	const element = document.getElementById(`doc-for-${route.query.scrollTo as string}`);
	element?.scrollIntoView({ behavior: 'smooth', block: 'start' });

	const containerElement = document.getElementById('container');
	if (!route.query.scrollTo && containerElement && containerElement.scrollTop > 200) {
		containerElement.scrollTo({ top: 0, behavior: 'smooth' });
	}

	if (codeblock.value) {
		highlight.highlightElement(codeblock.value);
	}
});

watch(
	() => route.query.scrollTo,
	() => {
		const element = document.getElementById(`doc-for-${route.query.scrollTo as string}`);
		element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	},
);
</script>
