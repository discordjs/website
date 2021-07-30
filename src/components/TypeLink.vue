<template>
	<span v-if="!link">{{ typeName }}</span>
	<router-link v-else-if="typeof link === 'object'" :to="link">{{ typeName }}</router-link>
	<a v-else :href="link" target="_blank" rel="noopener">
		{{ typeName }} <heroicons-outline-external-link class="h-5 w-5 inline-block mb-1" aria-hidden="true" />
	</a>
	<span v-if="type[1]">{{ type[1] }}</span>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

import { useStore } from '~/store';

const props = defineProps<{ type: string | string[] }>();

const store = useStore();

const docs = computed(() => store.state.docs);
const typeName = computed(() => (props.type[0] === 'function' ? 'Function' : props.type[0]));
// @ts-expect-error
const link = computed(() => (docs.value?.links[props.type[0]] ? docs.value.links[props.type[0]] : null));
</script>
