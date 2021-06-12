<template>
	<div
		class="
			prose prose-discord
			dark:prose-light
			mx-auto
			py-16
			px-4
			break-words-legacy
			sm:px-8
			lg:py-8
			w-full
			max-w-4xl
			lg:max-w-full
		"
	>
		<SourceButton class="float-right mt-2" :path="file?.path" />
		<div v-html="html"></div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useStore } from '~/store';
import { markdown } from '~/util/markdown';

import SourceButton from '~/components/SourceButton.vue';

const route = useRoute();
const store = useStore();

const docs = computed(() => store.state.docs);
const file = computed(() => store.state.file);
const html = computed(() => {
	// @ts-expect-error
	const file = docs.value?.custom[route.params.category].files[route.params.file];
	if (!file) return;
	store.commit({
		type: 'setFile',
		file,
	});
	let content: string;
	if (file.type === 'md') {
		content = file.content;
	} else {
		content = `# ${file.name as string}\n\`\`\`${file.type as string}\n${file.content as string}\n\`\`\``;
	}
	return markdown(content);
});

onMounted(() => {
	const containerElement = document.getElementById('container');
	if (containerElement && containerElement.scrollTop > 200) {
		containerElement.scrollTo({ top: 0, behavior: 'smooth' });
	}
});
</script>
