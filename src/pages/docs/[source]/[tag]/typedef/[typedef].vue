<template>
	<div class="mx-auto py-16 px-4 sm:px-8 lg:py-8 w-full">
		<SourceButton class="float-right mt-2" :meta="typedef?.meta" />

		<div class="prose prose-discord dark:prose-light break-words-legacy mx-auto max-w-4xl lg:max-w-full">
			<h1 :id="`doc-for-${typedef?.name}`">
				{{ typedef?.name }}
			</h1>

			<p v-if="typedef?.description" v-html="description"></p>
			<See v-if="typedef?.see" :see="typedef?.see" />

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
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useStore } from '~/store';
import { markdown } from '~/util/markdown';
import { convertLinks } from '~/util/convertLinks';
import { typeKey } from '~/util/typeKey';

import SourceButton from '~/components/SourceButton.vue';
import ExpandableTypes from '~/components/ExpandableTypes.vue';
import Types from '~/components/Types.vue';
import ParameterTable from '~/components/ParameterTable.vue';
import See from '~/components/See.vue';

const router = useRouter();
const route = useRoute();
const store = useStore();

const docs = computed(() => store.state.docs);

const typedef = docs.value?.typedefs.find((typedef) => typedef.name === route.params.typedef);

// @ts-expect-error
const description = computed(() => markdown(convertLinks(typedef?.description, docs.value, router, route)));

onMounted(() => {
	const containerElement = document.getElementById('container');
	if (containerElement && containerElement.scrollTop > 200) {
		containerElement.scrollTo({ top: 0, behavior: 'smooth' });
	}
});
</script>
