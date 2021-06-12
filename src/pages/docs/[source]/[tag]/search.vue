<template>
	<div class="mx-auto py-16 px-4 sm:px-8 lg:py-8 w-full">
		<div class="prose prose-discord dark:prose-light mx-auto max-w-4xl lg:max-w-full">
			<h1>Search Results</h1>
			<div>
				<ul class="no-list">
					<li
						v-for="result in results"
						:key="result.computedName"
						class="cursor-pointer grid grid-layout-search items-center !min-w-0 !min-h-0 break-words-legacy"
					>
						<span class="text-sm font-semibold uppercase">
							<span
								class="inline-flex items-center justify-center w-6 h-6 rounded-md"
								:class="getColourFromType(result.type)"
								>{{ getLetterFromType(result.type) }}</span
							>
						</span>
						<router-link exact :to="result.getLinkPath()">
							{{ result.computedName }}
						</router-link>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import { search, DocumentType } from '~/util/search';

const route = useRoute();

const query = ref(route.query.query);

const results = computed(() => search(query.value as string));

const getColourFromType = (type: DocumentType) => {
	switch (type) {
		case DocumentType.Class:
			return 'bg-discord-blurple-500 text-gray-200';
		case DocumentType.Method:
			return 'bg-yellow-500 text-gray-700';
		case DocumentType.Property:
			return 'bg-green-400 text-gray-700';
		case DocumentType.Events:
			return 'bg-yellow-900 text-gray-200';
		case DocumentType.Typedefs:
			return 'bg-purple-800 text-gray-200';
	}
};

const getLetterFromType = (type: DocumentType) => {
	switch (type) {
		case DocumentType.Class:
			return 'C';
		case DocumentType.Method:
			return 'M';
		case DocumentType.Property:
			return 'P';
		case DocumentType.Events:
			return 'E';
		case DocumentType.Typedefs:
			return 'T';
	}
};

watch(
	() => route.query.query,
	() => {
		query.value = route.query.query;
	},
);
</script>

<style>
.grid-layout-search {
	grid-template-columns: theme('spacing.10') 1fr;
}
</style>
