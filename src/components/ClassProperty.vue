<template>
	<div :id="`doc-for-${scrollTo}`" class="scroll-to mb-8">
		<SourceButton class="float-right mt-8" :meta="prop.meta" />

		<div class="flex items-center">
			<h3 class="inline-block mr-2">
				<router-link :to="{ name: 'docs-source-tag-class-class', query: { scrollTo } }">.{{ prop.name }}</router-link>
			</h3>
			<span class="space-x-2 text-gray-200 text-sm font-semibold uppercase pt-6">
				<span
					v-if="prop.scope === 'static'"
					class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-discord-blurple-500"
					>Static</span
				>
				<span v-if="prop.readonly" class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-discord-blurple-500"
					>Read-only</span
				>
				<span v-if="prop.deprecated" class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-discord-red-500"
					>Deprecated</span
				>
				<span
					v-if="prop.access === 'private'"
					class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-discord-red-500"
					>Private</span
				>
			</span>
		</div>

		<div class="grid pl-2.5">
			<p class="noprose" v-html="description"></p>
			<ParameterTable v-if="prop.props && prop.props.length > 0" :parameters="prop.props" />
			<div class="font-semibold">
				Type: <Types v-for="type in prop.type" :key="typeKey(type)" :names="type" :nullable="prop.nullable" />
			</div>
			<div v-if="prop.default">
				Default: <code>{{ prop.default }}</code>
			</div>
			<See v-if="prop.see" :see="prop.see" />
		</div>
	</div>

	<div class="w-full pr-32 lg:pr-96">
		<div class="h-px bg-gradient-to-r from-gray-500 rounded-full"></div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useStore } from '~/store';
import { convertLinks } from '~/util/convertLinks';
import { markdown } from '~/util/markdown';
import { typeKey } from '~/util/typeKey';

import SourceButton from '~/components/SourceButton.vue';
import ParameterTable from '~/components/ParameterTable.vue';
import Types from '~/components/Types.vue';
import See from '~/components/See.vue';

import type { DocumentationClassProperty } from '~/interfaces/Documentation';

const props = defineProps<{ prop: DocumentationClassProperty }>();

const router = useRouter();
const route = useRoute();
const store = useStore();

const docs = computed(() => store.state.docs);
// @ts-expect-error
const description = computed(() => markdown(convertLinks(props.prop.description, docs.value, router, route)));
const scrollTo = computed(() => `${props.prop.scope === 'static' ? 's-' : ''}${props.prop.name}`);
</script>
