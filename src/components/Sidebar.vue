<template>
	<div
		v-if="!isOpen"
		class="block fixed lg:hidden z-10 transition-transform transform-gpu"
		:class="isOpen ? 'translate-x-72 md:translate-x-80' : null"
	>
		<button
			type="button"
			class="
				rounded-md rounded-l-none rounded-tr-none
				p-3
				inline-flex
				items-center
				justify-center
				text-gray-200
				bg-discord-blurple-600
				hover:bg-discord-blurple-630 hover:text-white
				focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white
			"
			aria-controls="sidebar-menu"
			:aria-expanded="isOpen"
			@click="isOpen = !isOpen"
		>
			<span class="sr-only">Open menu</span>
			<heroicons-outline-chevron-right class="h-6 w-6" :class="{ hidden: isOpen, block: !isOpen }" aria-hidden="true" />
		</button>
	</div>
	<div
		ref="sidebarElement"
		class="inline-block fixed lg:block lg:relative z-10 sidebar-color transition transform-gpu"
		:class="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
	>
		<div class="sticky top-0 overflow-y-auto overflow-x-hidden w-72 md:w-80 lg:custom-scroll sidebar-height">
			<nav class="my-5 px-2 space-y-1 z-10">
				<ul>
					<li class="pb-1">
						<Disclosure v-slot="{ open }" :default-open="true">
							<DisclosureButton class="w-full focus:outline-none" tabindex="-1">
								<div class="text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center">
									<button
										class="leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
										:aria-expanded="open"
									>
										<span class="sr-only">{{ open ? 'Shrink' : 'Expand' }}</span>
										<heroicons-outline-chevron-right
											class="inline-block"
											:class="{ hidden: open }"
											aria-hidden="true"
										/>
										<heroicons-outline-chevron-down
											class="inline-block"
											:class="{ hidden: !open }"
											aria-hidden="true"
										/>
									</button>
									Docs settings
								</div>
							</DisclosureButton>
							<DisclosurePanel as="ul" class="px-2 space-y-3">
								<li>
									<Listbox v-slot="{ open: openSource }" v-model="selectedSource">
										<div class="relative mt-1">
											<ListboxButton
												class="
													relative
													w-full
													py-1
													px-3
													text-left
													flex
													justify-between
													items-center
													dark:text-gray-200
													rounded
													bg-gray-100
													dark:bg-[#1d1d1d]
													border
													dark:border-[#101010]
													cursor-pointer
												"
											>
												<span class="truncate">{{ selectedSource.name }}</span>
												<heroicons-outline-chevron-down v-if="!openSource" />
												<heroicons-outline-chevron-up v-if="openSource" />
											</ListboxButton>
											<ListboxOptions
												class="
													absolute
													w-full
													mt-1
													overflow-auto
													text-base
													dark:text-white
													bg-gray-100
													dark:bg-[#1d1d1d]
													rounded
													max-h-60
													border
													dark:border-[#101010]
													focus:outline-none
													z-40
													lg:custom-scroll
												"
											>
												<ListboxOption
													v-for="source in sources"
													v-slot="{ active }"
													:key="source.source.id"
													class="cursor-default"
													:value="source"
												>
													<li class="px-3 py-1" :class="{ 'bg-discord-blurple-500 text-gray-200': active }">
														<span class="truncate">{{ source.name }}</span>
													</li>
												</ListboxOption>
											</ListboxOptions>
										</div>
									</Listbox>
								</li>
								<li>
									<Listbox v-slot="{ open: openBranch }" v-model="selectedBranch">
										<div class="relative mt-1">
											<ListboxButton
												class="
													relative
													w-full
													py-1
													px-3
													text-left
													flex
													justify-between
													items-center
													dark:text-gray-200
													rounded
													bg-gray-100
													dark:bg-[#1d1d1d]
													border
													dark:border-[#101010]
													cursor-pointer
												"
											>
												<span class="truncate">{{ selectedBranch }}</span>
												<heroicons-outline-chevron-down v-if="!openBranch" />
												<heroicons-outline-chevron-up v-if="openBranch" />
											</ListboxButton>
											<ListboxOptions
												class="
													absolute
													w-full
													mt-1
													overflow-auto
													text-base
													dark:text-white
													bg-gray-100
													dark:bg-[#1d1d1d]
													rounded
													max-h-60
													border
													dark:border-[#101010]
													focus:outline-none
													z-40
													lg:custom-scroll
												"
											>
												<ListboxOption
													v-for="branch in branches"
													v-slot="{ active }"
													:key="branch"
													class="cursor-default"
													:value="branch"
												>
													<li class="px-3 py-1" :class="{ 'bg-discord-blurple-500 text-gray-200': active }">
														<span class="truncate">{{ branch }}</span>
													</li>
												</ListboxOption>
											</ListboxOptions>
										</div>
									</Listbox>
								</li>
								<li>
									<SwitchGroup>
										<div class="flex justify-between px-2">
											<SwitchLabel class="mr-4 dark:text-gray-200">Show privates</SwitchLabel>
											<Switch
												v-model="isShowPrivates"
												class="relative inline-flex h-6 items-center rounded-full w-11 focus:outline-none"
												:class="isShowPrivates ? 'bg-discord-red-500' : 'bg-gray-500'"
											>
												<span
													class="inline-block w-4 h-4 bg-white rounded-full transition transform-gpu z-20"
													:class="isShowPrivates ? 'translate-x-6' : 'translate-x-1'"
												></span>
											</Switch>
										</div>
									</SwitchGroup>
								</li>
							</DisclosurePanel>
						</Disclosure>
					</li>
					<li v-for="(category, categoryId) in docs?.custom" :key="categoryId">
						<Disclosure v-slot="{ open }" :default-open="true">
							<DisclosureButton class="w-full focus:outline-none" tabindex="-1">
								<div class="text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center">
									<button
										class="leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
										:aria-expanded="open"
									>
										<span class="sr-only">{{ open ? 'Shrink' : 'Expand' }}</span>
										<heroicons-outline-chevron-right
											class="inline-block"
											:class="{ hidden: open }"
											aria-hidden="true"
										/>
										<heroicons-outline-chevron-down
											class="inline-block"
											:class="{ hidden: !open }"
											aria-hidden="true"
										/>
									</button>
									<span class="truncate">{{ category.name }}</span>
								</div>
							</DisclosureButton>
							<DisclosurePanel as="ul">
								<li v-for="(file, fileId) in category.files" :key="fileId">
									<router-link
										:to="{
											name: 'docs-source-tag-category-file',
											params: { source: source?.id, tag: tag, category: categoryId, file: fileId },
										}"
										class="
											text-gray-600
											dark:text-gray-300
											border-l-4 border-transparent
											rounded-sm
											hover:border-l-4 hover:border-discord-blurple-500 hover:text-gray-800
											dark:hover:text-gray-100
											group
											flex
											items-center
											px-3
											py-2
											text-sm
											font-semibold
											focus:outline-none
											focus-visible:ring-1 focus-visible:ring-white
										"
										exact-active-class="border-l-4 border-discord-blurple-530 text-gray-900"
										@click="isOpen = false"
									>
										<span class="truncate">{{ typeof file === 'object' ? file.name : file }}</span>
									</router-link>
								</li>
							</DisclosurePanel>
						</Disclosure>
					</li>

					<Disclosure v-if="visibleClasses?.length" v-slot="{ open }" as="li" :default-open="true">
						<DisclosureButton class="w-full focus:outline-none" tabindex="-1">
							<div class="text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center">
								<button
									class="leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
									:aria-expanded="open"
								>
									<span class="sr-only">{{ open ? 'Shrink' : 'Expand' }}</span>
									<heroicons-outline-chevron-right class="inline-block" :class="{ hidden: open }" aria-hidden="true" />
									<heroicons-outline-chevron-down class="inline-block" :class="{ hidden: !open }" aria-hidden="true" />
								</button>
								Classes
							</div>
						</DisclosureButton>
						<DisclosurePanel as="ul">
							<li v-for="cls in visibleClasses" :key="cls.name">
								<router-link
									exact
									:to="{
										name: 'docs-source-tag-class-class',
										params: { source: source?.id, tag: tag, class: cls.name },
									}"
									class="
										text-gray-600
										dark:text-gray-300
										border-l-4 border-transparent
										rounded-sm
										hover:border-l-4 hover:border-discord-blurple-500 hover:text-gray-800
										dark:hover:text-gray-100
										group
										flex
										items-center
										px-3
										py-2
										text-sm
										font-semibold
										focus:outline-none
										focus-visible:ring-1 focus-visible:ring-white
									"
									exact-active-class="border-l-4 border-discord-blurple-530 text-gray-900"
									@click="isOpen = false"
								>
									<span class="truncate">{{ cls.name }}</span>
								</router-link>
							</li>
						</DisclosurePanel>
					</Disclosure>

					<Disclosure v-if="visibleTypedefs?.length" v-slot="{ open }" as="li" :default-open="true">
						<DisclosureButton class="w-full focus:outline-none" tabindex="-1">
							<div class="text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center">
								<button
									class="leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
									:aria-expanded="open"
								>
									<span class="sr-only">{{ open ? 'Shrink' : 'Expand' }}</span>
									<heroicons-outline-chevron-right class="inline-block" :class="{ hidden: open }" aria-hidden="true" />
									<heroicons-outline-chevron-down class="inline-block" :class="{ hidden: !open }" aria-hidden="true" />
								</button>
								Typedefs
							</div>
						</DisclosureButton>
						<DisclosurePanel as="ul">
							<li v-for="typedef in visibleTypedefs" :key="typedef.name">
								<router-link
									exact
									:to="{
										name: 'docs-source-tag-typedef-typedef',
										params: { source: source?.id, tag: tag, typedef: typedef.name },
									}"
									class="
										text-gray-600
										dark:text-gray-300
										border-l-4 border-transparent
										rounded-sm
										hover:border-l-4 hover:border-discord-blurple-500 hover:text-gray-800
										dark:hover:text-gray-100
										group
										flex
										items-center
										px-3
										py-2
										text-sm
										font-semibold
										focus:outline-none
										focus-visible:ring-1 focus-visible:ring-white
									"
									exact-active-class="border-l-4 border-discord-blurple-530 text-gray-900"
									@click="isOpen = false"
								>
									<span class="truncate">{{ typedef.name }}</span>
								</router-link>
							</li>
						</DisclosurePanel>
					</Disclosure>
				</ul>
			</nav>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onClickOutside, useBreakpoints, breakpointsTailwind, whenever } from '@vueuse/core';

import { useStore } from '~/store';
import MainSource from '~/data/MainSource';
import { isShowPrivates } from '~/util/showPrivates';

import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	SwitchGroup,
	SwitchLabel,
	Switch,
	Listbox,
	ListboxButton,
	ListboxOptions,
	ListboxOption,
} from '@headlessui/vue';

const router = useRouter();
const route = useRoute();
const store = useStore();
const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndLarger = breakpoints.greater('lg');

const isOpen = ref(false);
const sidebarElement = ref();

const sources = computed(() => store.state.sources);
const source = computed(() => store.state.source);
const tag = computed(() => store.state.tag);
const docs = computed(() => store.state.docs);
const branches = computed(() => store.state.branches);

const routeSource = computed(() => sources.value.find((source) => route.params.source === source.id));

const selectedSource = ref({
	source: routeSource.value?.source ?? MainSource,
	name: routeSource.value?.name ?? MainSource.name,
});
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const selectedBranch = ref(route.params.tag ?? MainSource.defaultTag);

const visibleClasses = computed(() =>
	isShowPrivates.value ? docs.value?.classes : docs.value?.classes.filter((cls) => cls.access !== 'private'),
);
const visibleTypedefs = computed(() =>
	isShowPrivates.value ? docs.value?.typedefs : docs.value?.typedefs.filter((typedef) => typedef.access !== 'private'),
);

onClickOutside(sidebarElement, () => (isOpen.value = false));
whenever(lgAndLarger, () => (isOpen.value = false), { immediate: true });
watch([selectedSource, selectedBranch], async ([currentSource, currentBranch], [prevSource, prevBranch]) => {
	if (currentSource !== prevSource) {
		selectedBranch.value = currentSource.source.defaultTag;
		return router.push({
			name: 'docs-source-tag-category-file',
			params: {
				source: currentSource.source.id,
				tag: currentSource.source.defaultTag,
				category: currentSource.source.defaultFile.category,
				file: currentSource.source.defaultFile.id,
			},
		});
	} else if (currentBranch !== prevBranch) {
		return router.push({
			name: 'docs-source-tag-category-file',
			params: {
				source: currentSource.source.id,
				tag: currentBranch,
				category: currentSource.source.defaultFile.category,
				file: currentSource.source.defaultFile.id,
			},
		});
	}
});
</script>

<style>
.sidebar-height {
	height: calc(100vh - theme('height.16'));
}

.sidebar-color::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 999em;
	background: #ffffff;
	pointer-events: none;
}

.dark .sidebar-color::before {
	background: #191919;
}
</style>
