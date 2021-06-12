<template>
	<Disclosure v-if="typedef" v-slot="{ open }" as="div">
		<DisclosureButton as="div" class="focus:outline-none">
			<div class="flex gap-1 items-center -ml-1">
				<span class="font-semibold">{{ nullable ? '?' : '' }}{{ variable ? '...' : '' }}</span
				><TypeLink v-for="type in names" :key="typeKey(type)" :type="type" />
				<button class="leading-3 focus:outline-none" :aria-expanded="open">
					<span class="sr-only">{{ open ? 'Shrink' : 'Expand' }}</span>
					<heroicons-outline-plus class="inline-block" :class="{ hidden: open }" aria-hidden="true" />
					<heroicons-outline-minus class="inline-block" :class="{ hidden: !open }" aria-hidden="true" />
				</button>
			</div>
		</DisclosureButton>
		<DisclosurePanel>
			<ParameterTable v-if="typedef?.props" :parameters="typedef?.props" />
			<div v-else v-html="description"></div>
		</DisclosurePanel>
	</Disclosure>
	<Types v-else :names="names" />
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useStore } from '~/store';
import { markdown } from '~/util/markdown';
import { convertLinks } from '~/util/convertLinks';
import { typeKey } from '~/util/typeKey';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';

import TypeLink from './TypeLink.vue';
import ParameterTable from './ParameterTable.vue';
import Types from './Types.vue';

const props = defineProps(['names', 'variable', 'nullable']);

const router = useRouter();
const route = useRoute();
const store = useStore();

const docs = computed(() => store.state.docs);

const typedef = ref(docs.value?.typedefs.find((typedef) => typedef.name === props.names[0][0]));

// @ts-expect-error
const description = computed(() => markdown(convertLinks(typedef.value?.description, docs.value, router, route)));
</script>
