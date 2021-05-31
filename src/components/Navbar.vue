<template>
	<div class="sticky top-0 z-20">
		<header class="bg-discord-blurple-560">
			<div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 lg:flex lg:justify-between">
				<nav class="hidden lg:py-2 lg:flex lg:space-x-8" aria-label="Global navigation">
					<router-link
						to="/"
						class="
							text-gray-200
							hover:bg-discord-blurple-630
							hover:text-white
							rounded-md
							py-2
							px-3
							inline-flex
							items-center
							text-sm
							font-semibold
							focus:outline-none
							focus-visible:ring-1 focus-visible:ring-white
						"
						active-class="bg-discord-blurple-600"
					>
						discord.js
					</router-link>

					<router-link
						to="/docs"
						class="
							text-gray-200
							hover:bg-discord-blurple-630
							hover:text-white
							rounded-md
							py-2
							px-3
							inline-flex
							items-center
							text-sm
							font-semibold
							focus:outline-none
							focus-visible:ring-1 focus-visible:ring-white
						"
						active-class="bg-discord-blurple-600"
					>
						Documentation
					</router-link>

					<a
						:href="`https://github.com/${repository}`"
						class="
							text-gray-200
							hover:bg-discord-blurple-630
							hover:text-white
							rounded-md
							py-2
							px-3
							inline-flex
							items-center
							text-sm
							font-semibold
							focus:outline-none
							focus-visible:ring-1 focus-visible:ring-white
						"
						target="_blank"
						rel="noopener"
					>
						<span class="mr-2">GitHub</span><heroicons-outline-external-link class="h-5 w-5" />
					</a>

					<a
						href="https://discordjs.guide"
						class="
							text-gray-200
							hover:bg-discord-blurple-630
							hover:text-white
							rounded-md
							py-2
							px-3
							inline-flex
							items-center
							text-sm
							font-semibold
							focus:outline-none
							focus-visible:ring-1 focus-visible:ring-white
						"
						target="_blank"
						rel="noopener"
					>
						<span class="mr-2">Guide</span><heroicons-outline-external-link class="h-5 w-5" />
					</a>
				</nav>

				<div class="relative h-16 flex lg:max-w-lg lg:w-full">
					<div class="relative z-10 flex items-center lg:hidden">
						<button
							class="
								rounded-md
								p-2
								inline-flex
								items-center
								justify-center
								hover:bg-discord-blurple-630
								focus:outline-none
								focus:ring-2 focus:ring-inset focus:ring-white
								focus:bg-discord-blurple-630
							"
							:aria-label="`Switch to ${isDarkMode ? 'light theme' : 'dark theme'}`"
							@click="toggleDarkMode()"
						>
							<heroicons-outline-sun
								v-if="!isDarkMode"
								class="fill-current text-gray-200 hover:text-white h-6 w-6"
								aria-hidden="true"
							/>
							<heroicons-outline-moon
								v-else
								class="fill-current text-gray-200 hover:text-white h-6 w-6"
								aria-hidden="true"
							/>
						</button>
					</div>
					<div class="relative z-0 flex-1 px-2 flex lg:gap-2 items-center justify-center">
						<button
							class="
								hidden
								lg:block
								rounded-md
								p-2
								hover:bg-discord-blurple-630
								focus:outline-none
								focus:ring-1 focus:ring-inset focus:ring-white
							"
							:aria-label="`Switch to ${isDarkMode ? 'light theme' : 'dark theme'}`"
							@click="toggleDarkMode()"
						>
							<heroicons-outline-sun
								v-if="!isDarkMode"
								class="fill-current text-gray-200 hover:text-white h-6 w-6"
								aria-hidden="true"
							/>
							<heroicons-outline-moon
								v-else
								class="fill-current text-gray-200 hover:text-white h-6 w-6"
								aria-hidden="true"
							/>
						</button>
						<div class="w-full sm:max-w-lg lg:max-w-xs">
							<label for="search" class="sr-only">Search</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center" aria-hidden="true">
									<heroicons-outline-search class="h-5 w-5 text-gray-200" />
								</div>
								<input
									id="search"
									v-model="searchInput"
									name="search"
									class="
										block
										w-full
										bg-discord-blurple-600
										border border-transparent
										rounded-md
										py-2
										pl-10
										pr-3
										text-sm text-white
										placeholder-gray-200
										focus:outline-none
										focus:bg-discord-blurple-630
										focus:text-gray-200
										focus:placeholder-gray-200
										focus:ring-2 focus:ring-inset focus:ring-white
										lg:focus:ring-1
									"
									placeholder="Search"
									type="search"
									autocomplete="off"
									@focus="searchFocus = true"
									@focusout="unfocus()"
									@keyup.enter="gotoSearch"
								/>
								<div class="absolute w-full">
									<ul v-if="searchFocus">
										<li
											v-for="result in searchResults"
											:key="result.computedName"
											class="py-2 pl-5 pr-3 bg-discord-blurple-600 text-white hover:bg-discord-blurple-760"
										>
											<router-link exact :to="result.getLinkPath()">
												{{ result.computedName }}
											</router-link>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="relative z-10 flex items-center lg:hidden">
						<button
							type="button"
							class="
								rounded-md
								p-2
								inline-flex
								items-center
								justify-center
								text-gray-200
								hover:bg-discord-blurple-630
								hover:text-white
								focus:outline-none
								focus:ring-2 focus:ring-inset focus:ring-white
							"
							aria-controls="mobile-menu"
							:aria-expanded="isOpen"
							@click="isOpen = !isOpen"
						>
							<span class="sr-only">Open menu</span>
							<heroicons-outline-menu :class="{ hidden: isOpen, block: !isOpen }" aria-hidden="true" />
							<heroicons-outline-x :class="{ block: isOpen, hidden: !isOpen }" aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>

			<transition
				enter-active-class="transition transform-gpu duration-300 ease-out"
				enter-from-class="translate-x-12 opacity-0"
				enter-to-class="translate-x-0 opacity-100"
			>
				<nav v-if="isOpen" id="mobile-menu" ref="navbarElement" class="lg:hidden" aria-label="Global navigation">
					<div class="pt-2 pb-3 px-2 space-y-1">
						<router-link
							to="/"
							class="
								text-gray-200
								hover:bg-discord-blurple-630
								hover:text-white
								block
								rounded-md
								py-2
								px-3
								text-base
								font-semibold
							"
							@click="isOpen = !isOpen"
							>discord.js</router-link
						>

						<router-link
							to="/docs"
							class="
								text-gray-200
								hover:bg-discord-blurple-630
								hover:text-white
								block
								rounded-md
								py-2
								px-3
								text-base
								font-semibold
							"
							@click="isOpen = !isOpen"
							>Documentation</router-link
						>

						<a
							:href="`https://github.com/${repository}`"
							class="
								text-gray-200
								hover:bg-discord-blurple-630
								hover:text-white
								block
								rounded-md
								py-2
								px-3
								text-base
								font-semibold
							"
							target="_blank"
							rel="noopener"
							@click="isOpen = !isOpen"
							><span class="mr-2">Github</span><heroicons-outline-external-link class="h-5 w-5 inline-block"
						/></a>

						<a
							href="https://discordjs.guide"
							class="
								text-gray-200
								hover:bg-discord-blurple-630
								hover:text-white
								block
								rounded-md
								py-2
								px-3
								text-base
								font-semibold
							"
							target="_blank"
							rel="noopener"
							@click="isOpen = !isOpen"
							><span class="mr-2">Guide</span><heroicons-outline-external-link class="h-5 w-5 inline-block"
						/></a>
					</div>
				</nav>
			</transition>
		</header>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside, useBreakpoints, breakpointsTailwind, whenever } from '@vueuse/core';

import { useStore } from '~/store';
import { isDarkMode, toggleDarkMode } from '~/util/darkMode';
import { search } from '~/util/search';

const store = useStore();
const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndLarger = breakpoints.greater('lg');

const isOpen = ref(false);
const navbarElement = ref();

const repository = computed(() => store.state.source?.repo);

onClickOutside(navbarElement, () => (isOpen.value = false));

whenever(lgAndLarger, () => (isOpen.value = false));
const router = useRouter();

const searchInput = ref('');
const searchResults = computed(() => search(searchInput.value).slice(0, 6));

const searchFocus = ref(false);
function unfocus() {
	// timeout is needed because element gets unmounted before the link can finish resolving
	setTimeout(() => (searchFocus.value = false), 300);
}

function gotoSearch() {
	return router.push({
		name: 'docs-source-tag-search',
		query: {
			query: searchInput.value,
		},
	});
}
</script>
