<template>
	<div class="break-words-legacy mt-4">
		See also:

		<ul v-if="see.length > 1">
			<li v-for="s in parsed" :key="s.text">
				<router-link v-if="typeof s.link === 'object'" :to="s.link">{{ s.text }}</router-link>
				<a v-else-if="typeof s.link === 'string'" :href="s.link" target="_blank" rel="noopener"
					>{{ s.text }} <heroicons-outline-external-link class="h-5 w-5 inline-block mb-1" aria-hidden="true"
				/></a>
				<span v-else>{{ s.text }}</span>
			</li>
		</ul>

		<span v-else>
			<router-link v-if="typeof parsed[0].link === 'object'" :to="parsed[0].link">{{ parsed[0].text }}</router-link>
			<a v-else-if="typeof parsed[0].link === 'string'" :href="parsed[0].link" target="_blank" rel="noopener"
				>{{ parsed[0].text }} <heroicons-outline-external-link class="h-5 w-5 inline-block mb-1" aria-hidden="true"
			/></a>
			<span v-else>{{ parsed[0].text }}</span>
		</span>
	</div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

import { useStore } from '~/store';
import { parseLink } from '~/util/parseLink';

const props = defineProps<{ see: string[] }>();

const store = useStore();

const docs = computed(() => store.state.docs);
const parsed = computed<
	{
		link: string | { name: string; params: { [key: string]: string }; query: { [key: string]: string } };
		text: string;
	}[]
>(() => {
	const parsed = new Array(props.see.length);
	for (let s = 0; s < props.see.length; s++) {
		// @ts-expect-error
		parsed[s] = parseLink(props.see[s], docs.value);
	}
	return parsed;
});
</script>
