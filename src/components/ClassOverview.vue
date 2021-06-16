<template>
	<div class="grid sm:grid-cols-2 mb-10" :class="events && events.length ? 'md:grid-cols-3' : null">
		<div v-if="visibleProperties && visibleProperties.length">
			<Disclosure v-slot="{ open }" :default-open="isOpen">
				<DisclosureButton class="focus:outline-none" tabindex="-1">
					<div class="text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center">
						<button
							class="leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
							:aria-expanded="open"
						>
							<span class="sr-only">{{ open ? 'Shrink' : 'Expand' }}</span>
							<heroicons-outline-chevron-right class="inline-block" :class="{ hidden: open }" aria-hidden="true" />
							<heroicons-outline-chevron-down class="inline-block" :class="{ hidden: !open }" aria-hidden="true" />
						</button>
						Properties
					</div>
				</DisclosureButton>
				<DisclosurePanel as="ul" class="no-list !mt-0 pl-2">
					<li
						v-for="property in visibleProperties"
						:key="scopedName(property)"
						class="
							cursor-pointer
							mb-14
							border-l-4 border-transparent
							rounded-sm
							hover:border-l-4 hover:border-discord-blurple-500
						"
						@click="scrollTo(scopedName(property))"
					>
						<router-link
							:to="{ name: 'docs-source-tag-class-class', query: { scrollTo: scopedName(property) } }"
							class="mx-2"
						>
							{{ property.name }}
						</router-link>
						<span class="text-gray-200 text-sm font-semibold uppercase">
							<span
								v-if="property.scope === 'static'"
								class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-discord-blurple-500"
								>S</span
							>
							<span
								v-if="property.abstract"
								class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-discord-blurple-500"
								>A</span
							>
							<span
								v-if="property.deprecated"
								class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-discord-red-500"
								>D</span
							>
							<span
								v-if="property.access === 'private'"
								class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-discord-red-500"
								>P</span
							>
						</span>
					</li>
				</DisclosurePanel>
			</Disclosure>
		</div>

		<div v-if="visibleMethods && visibleMethods.length">
			<Disclosure v-slot="{ open }" :default-open="isOpen">
				<DisclosureButton class="focus:outline-none" tabindex="-1">
					<div class="text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center">
						<button
							class="leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
							:aria-expanded="open"
						>
							<span class="sr-only">{{ open ? 'Shrink' : 'Expand' }}</span>
							<heroicons-outline-chevron-right class="inline-block" :class="{ hidden: open }" aria-hidden="true" />
							<heroicons-outline-chevron-down class="inline-block" :class="{ hidden: !open }" aria-hidden="true" />
						</button>
						Methods
					</div>
				</DisclosureButton>
				<DisclosurePanel as="ul" class="no-list !mt-0 pl-2">
					<li
						v-for="method in visibleMethods"
						:key="scopedName(method)"
						class="
							cursor-pointer
							border-l-4 border-transparent
							rounded-sm
							hover:border-l-4 hover:border-discord-blurple-500
						"
						@click="scrollTo(scopedName(method))"
					>
						<router-link
							:to="{ name: 'docs-source-tag-class-class', query: { scrollTo: scopedName(method) } }"
							class="mx-2"
						>
							{{ method.name }}
						</router-link>
						<span class="text-gray-200 text-sm font-semibold uppercase">
							<span
								v-if="method.scope === 'static'"
								class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-discord-blurple-500"
								>S</span
							>
							<span
								v-if="method.abstract"
								class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-discord-blurple-500"
								>A</span
							>
							<span
								v-if="method.deprecated"
								class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-discord-red-500"
								>D</span
							>
							<span
								v-if="method.access === 'private'"
								class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-discord-red-500"
								>P</span
							>
						</span>
					</li>
				</DisclosurePanel>
			</Disclosure>
		</div>

		<div v-if="visibleEvents && visibleEvents.length">
			<Disclosure v-slot="{ open }" :default-open="isOpen">
				<DisclosureButton class="focus:outline-none" tabindex="-1">
					<div class="text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center">
						<button
							class="leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
							:aria-expanded="open"
						>
							<span class="sr-only">{{ open ? 'Shrink' : 'Expand' }}</span>
							<heroicons-outline-chevron-right class="inline-block" :class="{ hidden: open }" aria-hidden="true" />
							<heroicons-outline-chevron-down class="inline-block" :class="{ hidden: !open }" aria-hidden="true" />
						</button>
						Events
					</div>
				</DisclosureButton>
				<DisclosurePanel as="ul" class="no-list !mt-0 pl-2">
					<li
						v-for="event in visibleEvents"
						:key="event.name"
						class="
							cursor-pointer
							border-l-4 border-transparent
							rounded-sm
							hover:border-l-4 hover:border-discord-blurple-500
						"
						@click="scrollTo(`e-${event.name}`)"
					>
						<router-link
							:to="{ name: 'docs-source-tag-class-class', query: { scrollTo: `e-${event.name}` } }"
							class="mx-2"
						>
							{{ event.name }}
						</router-link>
						<span
							v-if="event.deprecated"
							class="
								text-gray-200 text-sm
								font-semibold
								uppercase
								inline-flex
								items-center
								justify-center
								w-6
								h-6
								rounded-md
								bg-discord-red-500
							"
							>D</span
						>
					</li>
				</DisclosurePanel>
			</Disclosure>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import { useBreakpoints, breakpointsTailwind, whenever } from '@vueuse/core';

import { scopedName } from '~/util/scopedName';
import { isShowPrivates } from '~/util/showPrivates';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';

import type {
	DocumentationClassEvent,
	DocumentationClassMethod,
	DocumentationClassProperty,
} from '~/interfaces/Documentation';

const props = defineProps<{
	properties?: DocumentationClassProperty[];
	methods?: DocumentationClassMethod[];
	events?: DocumentationClassEvent[];
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndLarger = breakpoints.greater('lg');

const isOpen = ref(false);

const visibleProperties = computed(() =>
	isShowPrivates.value ? props.properties : props.properties?.filter((prop) => prop.access !== 'private'),
);
const visibleMethods = computed(() =>
	isShowPrivates.value ? props.methods : props.methods?.filter((prop) => prop.access !== 'private'),
);
const visibleEvents = computed(() =>
	isShowPrivates.value ? props.events : props.events?.filter((prop) => prop.access !== 'private'),
);

const scrollTo = (elementName: string) => {
	const element = document.getElementById(`doc-for-${elementName}`);
	element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

whenever(lgAndLarger, () => (isOpen.value = true), { immediate: true });
</script>
