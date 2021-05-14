<template>
	<div v-if="offlineReady || needRefresh" class="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-20">
		<div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
			<div class="p-2 rounded-lg bg-discord-blurple-600 dark:bg-discord-blurple-700 shadow-lg sm:p-3">
				<div class="flex items-center justify-between flex-wrap">
					<div class="w-0 flex-1 flex items-center">
						<span class="flex p-2 rounded-lg bg-discord-blurple-530 dark:bg-discord-blurple-630">
							<heroicons-outline-download class="fill-current text-gray-200 h-6 w-6" aria-hidden="true" />
						</span>
						<p class="ml-3 font-medium text-white truncate">
							<span class="sm:hidden">{{
								offlineReady ? 'App ready to work offline.' : 'New content available.'
							}}</span>
							<span class="hidden sm:inline">{{
								offlineReady ? 'App ready to work offline.' : 'New content available, click refresh to update.'
							}}</span>
						</p>
					</div>
					<div v-if="needRefresh" class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
						<button
							class="
								flex
								items-center
								justify-center
								px-4
								py-2
								border border-transparent
								rounded-md
								text-sm
								font-medium
								text-gray-200
								bg-discord-blurple-530
								dark:bg-discord-blurple-630
								hover:bg-discord-blurple-460
								dark:hover:bg-discord-blurple-600
								focus:outline-none
								focus-visible:ring-1 focus-visible:ring-white
							"
							@click="updateServiceWorker(true)"
						>
							Refresh
						</button>
					</div>
					<div class="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
						<button
							type="button"
							class="-mr-1 flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
							@click="close"
						>
							<span class="sr-only">Dismiss</span>
							<heroicons-outline-x class="fill-current text-gray-200 h-6 w-6" aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = () => {
	offlineReady.value = false;
	needRefresh.value = false;
};
</script>
