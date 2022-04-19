<template>
	<div class="mx-auto py-16 px-4 sm:px-8 lg:py-8 w-full">
		<SourceButton class="float-right mt-2" :meta="typedef?.meta" />

		<div class="prose prose-discord dark:prose-light break-words-legacy mx-auto max-w-4xl lg:max-w-full">
			<h1 :id="`doc-for-${typedef?.name}`">
				{{ typedef?.name }}
			</h1>

			<p v-if="typedef?.description" v-html="description"></p>
			<See v-if="typedef?.see?.length" :see="typedef?.see" />

			<h2>Types</h2>
			<ul id="typedef-types">
				<li v-for="type in typedef?.type" :key="typeKey(type)">
					<ExpandableTypes class="!m-0" :names="type" />
				</li>
			</ul>

			<div v-if="typedef?.props && typedef?.props.length">
				<h2>Properties</h2>
				<ParameterTable :parameters="typedef.props" />
			</div>

			<div v-if="typedef?.params && typedef?.params.length">
				<h2>Parameters</h2>
				<ParameterTable :parameters="typedef.params" />
			</div>

			<div v-if="typedef?.returns">
				<h2>Returns</h2>
				<p>
					<span v-if="typedef.returns && Array.isArray(typedef.returns)">
						<Types v-for="rtrn in typedef.returns" :key="typeKey(rtrn)" :names="rtrn" />
					</span>
					<span v-else-if="typedef.returns && !Array.isArray(typedef.returns)">
						<Types
							v-for="rtrn in typedef.returns.types || typedef.returns"
							:key="typeKey(rtrn)"
							:names="rtrn"
							:variable="typedef.returns.variable"
							:nullable="typedef.returns.nullable"
						/>
					</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ExpandableTypes from '~/components/ExpandableTypes.vue';
import ParameterTable from '~/components/ParameterTable.vue';
import See from '~/components/See.vue';
import SourceButton from '~/components/SourceButton.vue';
import Types from '~/components/Types.vue';
import { useStore } from '~/store';
import { convertLinks } from '~/util/convertLinks';
import { markdown } from '~/util/markdown';
import { typeKey } from '~/util/typeKey';

const router = useRouter();
const route = useRoute();
const store = useStore();

const docs = computed(() => store.state.docs);

const typedef = docs.value?.typedefs.find((typedef) => typedef.name === route.params.typedef);

// @ts-expect-error
const description = computed(() => markdown(convertLinks(typedef?.description, docs.value, router, route)));

useHead({
	title: computed(() => `discord.js | ${typedef?.name ?? ''}`),
});

onMounted(() => {
	const containerElement = document.getElementById('container');
	if (containerElement && containerElement.scrollTop > 200) {
		containerElement.scrollTo({ top: 0, behavior: 'smooth' });
	}
});
</script>
