<template>
	<div :id="`doc-for-e-${event.name}`" class="scroll-to">
		<SourceButton class="float-right mt-8" :meta="event.meta" />

		<h3 class="inline-block mr-2">
			<router-link :to="{ name: 'docs-source-tag-class-class', query: { scrollTo: `e-${event.name}` } }">{{
				event.name
			}}</router-link>
		</h3>
		<span
			v-if="event.deprecated"
			class="
				inline-flex
				items-center
				px-2.5
				py-1
				rounded-md
				text-sm
				font-medium
				bg-discord-red-500
				text-gray-200
				uppercase
			"
			>Deprecated</span
		>

		<div class="grid p-2">
			<p class="noprose" v-html="description"></p>
			<ParameterTable v-if="event.params && event.params.length" :parameters="event.params" />
			<See v-if="event.see" :see="event.see" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useStore } from '~/store';
import { convertLinks } from '~/util/convertLinks';
import { markdown } from '~/util/markdown';

import SourceButton from '~/components/SourceButton.vue';
import ParameterTable from '~/components/ParameterTable.vue';
import See from '~/components/See.vue';

import type { DocumentationClassEvent } from '~/interfaces/Documentation';

const props = defineProps<{ event: DocumentationClassEvent }>();

const router = useRouter();
const route = useRoute();
const store = useStore();

const docs = computed(() => store.state.docs);
// @ts-ignore
const description = computed(() => markdown(convertLinks(props.event.description, docs.value, router, route)));
</script>
