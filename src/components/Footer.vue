<template>
	<footer class="bg-discord-blurple-560">
		<div class="max-w-3xl mx-auto text-center px-16 pt-10 pb-4 text-gray-200">
			<strong><router-link to="/">discord.js</router-link></strong>
			<p class="mb-4">A powerful library for interacting with the Discord API</p>
			<Stats class="mb-4" />
			<p class="text-xs break-words-legacy">
				commit: {{ gitCommit }}<br />
				built at: {{ builtAt }}
			</p>
		</div>
	</footer>
</template>

<script lang="ts">
declare const GIT_COMMIT_HASH: string;
declare const BUILT_AT: string;
</script>

<script setup lang="ts">
import { ref } from 'vue';
import Stats from './Stats.vue';

const gitCommit = ref(GIT_COMMIT_HASH);
const builtAt = ref(new Date(BUILT_AT).toUTCString());
</script>
