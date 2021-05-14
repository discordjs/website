<template>
	<div class="min-h-full grid grid-layout bg-white dark:bg-[#1d1d1d]">
		<Navbar />
		<div>
			<router-view />
		</div>
		<Footer />
	</div>
	<SWBanner />
</template>

<script setup lang="ts">
import { useStore } from './store';

import Navbar from '~/components/Navbar.vue';
import SWBanner from '~/components/SWBanner.vue';

const store = useStore();

void store.dispatch('fetchStats');
</script>

<style>
.grid-layout {
	grid-template-rows: auto 1fr auto;
}
</style>
