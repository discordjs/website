<template>
	<div class="mx-auto py-16 px-4 sm:px-8 lg:py-8 w-full">
		<div class="prose prose-discord dark:prose-light mx-auto max-w-4xl lg:max-w-full">
			<h1>Search Results</h1>
			<div class="flex flex-col md:flex-row">
				<div class="flex-auto">
					<input
						v-model="filter"
						:value="DocumentType.Class"
						type="checkbox"
						class="form-checkbox rounded-sm h-5 w-5 text-discord-blurple-500"
					/>
					Classes
				</div>
				<div class="flex-auto">
					<input
						v-model="filter"
						:value="DocumentType.Method"
						type="checkbox"
						class="form-checkbox rounded-sm h-5 w-5 text-yellow-500"
					/>
					Methods
				</div>
				<div class="flex-auto">
					<input
						v-model="filter"
						:value="DocumentType.Property"
						type="checkbox"
						class="form-checkbox rounded-sm h-5 w-5 text-green-400"
					/>
					Properties
				</div>
				<div class="flex-auto">
					<input
						v-model="filter"
						:value="DocumentType.Typedefs"
						type="checkbox"
						class="form-checkbox rounded-sm h-5 w-5 text-purple-800"
					/>
					Typedefs
				</div>
				<div class="flex-auto">
					<input
						v-model="filter"
						:value="DocumentType.Events"
						type="checkbox"
						class="form-checkbox rounded-sm h-5 w-5 text-yellow-900"
					/>
					Events
				</div>
			</div>
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

const filter = ref([
	DocumentType.Class,
	DocumentType.Method,
	DocumentType.Property,
	DocumentType.Events,
	DocumentType.Typedefs,
]);

const route = useRoute();

const query = ref(route.query.query);

const results = computed(() => {
	return search(query.value as string).filter((r) => filter.value.includes(r.type));
});

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
