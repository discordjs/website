<template>
	<div class="mx-auto py-8 px-4 sm:px-8 w-full">
		<div class="prose prose-discord dark:prose-light mx-auto max-w-4xl lg:max-w-full">
			<h1>Search Results</h1>
			<div>
				<ul class="no-list">
					<li v-for="result in results" :key="result.computedName" class="cursor-pointer">
						<span class="text-white text-sm font-semibold uppercase mr-1">
							<span
								class="inline-flex items-center px-1.5 rounded-md bg-or font-semibold"
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
import { search, DocumentType } from '~/util/search';
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const query = ref(route.query.query);
watch(
	() => route.query.query,
	() => {
		query.value = route.query.query;
	},
);
const results = computed(() => search(query.value));

function getColourFromType(type: DocumentType) {
	switch (type) {
		case DocumentType.Class:
			return 'bg-discord-blurple-500';
		case DocumentType.Method:
			return 'bg-yellow-500';
		case DocumentType.Property:
			return 'bg-green-400';
		case DocumentType.Events:
			return 'bg-yellow-900';
		case DocumentType.Typedefs:
			return 'bg-purple-800';
	}
}

function getLetterFromType(type: DocumentType) {
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
}
</script>
