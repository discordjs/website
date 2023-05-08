<template>
	<div class="docs-type inline-block whitespace-pre-wrap">
		<span class="font-semibold">{{ nullable ? '?' : '' }}{{ variable ? '...' : '' }}</span>
		<span v-if="Array.isArray(names)">
			<template v-for="type in names">
				<TypeLink v-if="type[1]" :key="typeKey(type)" :type="type" />
				<div v-else :key="typeKey(type)" class="docs-type inline-block whitespace-pre-wrap">
					<TypeLink :type="type" />
				</div>
			</template>
		</span>
	</div>
</template>

<script setup lang="ts">
import TypeLink from './TypeLink.vue';
import { typeKey } from '~/util/typeKey';

defineProps<{ names: any; nullable?: boolean; variable?: boolean }>();
</script>

<style>
.docs-type:not(:last-child)::after {
	content: ' or ';
}
</style>
