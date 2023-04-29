<template>
	<div class="docs-type inline-block whitespace-pre-wrap">
		<span class="font-semibold">{{ nullable ? '?' : '' }}{{ variable ? '...' : '' }}</span>
		<span v-if="Array.isArray(names)">
			<template v-for="(type, index) in names">
				<span v-if="index > 0"> or </span>
				<TypeLink :key="typeKey(type)" :type="type" />
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
