<template>
	<div class="min-h-full grid grid-layout">
		<Navbar />
		<div id="container" class="grid grid-layout-container lg:custom-scroll">
			<div class="bg-white dark:bg-[#1d1d1d]">
				<router-view />
			</div>
			<Footer />
		</div>
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
	grid-template-rows: auto 1fr;
}

.grid-layout-container {
	grid-template-rows: 1fr auto;
}
</style>
