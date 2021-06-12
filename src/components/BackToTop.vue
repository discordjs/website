<template>
	<div class="fixed bottom-0 right-0 pb-4">
		<div class="px-6 lg:px-8">
			<button
				class="
					bg-discord-blurple-500
					hover:bg-discord-blurple-530
					dark:hover:bg-discord-blurple-560
					text-gray-200
					hover:text-white
					rounded-md
					p-2
					leading-3
					focus:outline-none
					focus-visible:ring-1 focus-visible:ring-gray-200
				"
				@click="scrollTo()"
			>
				<heroicons-outline-arrow-narrow-up class="h-6 w-6" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
const scrollTo = () => document.getElementById('container')?.scrollTo({ top: 0, behavior: 'smooth' });
</script>
