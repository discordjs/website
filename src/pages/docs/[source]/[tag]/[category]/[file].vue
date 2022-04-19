<template>
	<div
		class="prose prose-discord dark:prose-light mx-auto py-16 px-4 break-words-legacy sm:px-8 lg:py-8 w-full max-w-4xl lg:max-w-full"
	>
		<SourceButton class="float-right mt-2" :path="file?.path" />
		<div v-html="html"></div>
	</div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SourceButton from '~/components/SourceButton.vue';
import { useStore } from '~/store';
import { usePreferredReducedMotion } from '~/util/ReducedMotion';
import { markdown } from '~/util/markdown';

const route = useRoute();
const store = useStore();

const docs = computed(() => store.state.docs);
const file = computed(() => store.state.file);
const html = computed(() => {
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
	const file = docs.value?.custom[route.params.category].files[route.params.file];
	if (!file) return;
	store.commit({
		type: 'setFile',
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		file,
	});
	let content: string;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (file.type === 'md') {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		content = file.content;
	} else {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		content = `# ${file.name as string}\n\`\`\`${file.type as string}\n${file.content as string}\n\`\`\``;
	}
	return markdown(content);
});

useHead({
	title: computed(() => `discord.js | ${file.value?.name ?? ''}`),
});

onMounted(() => {
	const containerElement = document.getElementById('container');
	if (containerElement && containerElement.scrollTop > 200) {
		containerElement.scrollTo({ top: 0, behavior: usePreferredReducedMotion.value ? undefined : 'smooth' });
	}
});
</script>
