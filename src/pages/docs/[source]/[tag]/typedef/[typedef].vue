<template>
	<div class="mx-auto py-16 px-4 sm:px-8 lg:py-8 w-full">
		<SourceButton class="float-right mt-2" :meta="typedef?.meta" />

		<div class="prose prose-discord dark:prose-light break-words-legacy mx-auto max-w-4xl lg:max-w-full">
			<h1 :id="`doc-for-${typedef?.name}`">
				{{ typedef?.name }}
			</h1>

			<p v-if="typedef?.description" v-html="description"></p>
			<See v-if="typedef?.see?.length" :see="typedef?.see" />

			<template v-if="typedef?.type">
				<h2>Types</h2>
				<ul id="typedef-types">
					<li v-for="type in typedef?.type" :key="typeKey(type)">
						<ExpandableTypes class="!m-0" :names="type" />
					</li>
				</ul>
			</template>

			<template v-if="typedef?.props && typedef?.props.length">
				<h2>Properties</h2>
				<ParameterTable :parameters="typedef.props" />
			</template>

			<template v-if="typedef?.params && typedef?.params.length">
				<h2>Parameters</h2>
				<ParameterTable :parameters="typedef.params" />
			</template>

			<template v-if="typedef?.returns">
				<h2>Returns</h2>
				<span v-if="typedef.returns && Array.isArray(typedef.returns)">
					<template v-if="docs!.meta!.format >= 30">
						<template v-if="Array.isArray(typedef.returns[0])">
							<Types v-for="rtrn in typedef.returns.flat()" :key="typeKey(rtrn)" :names="rtrn" />
						</template>
						<template v-else>
							<Types
								v-for="rtrn in typedef.returns.flat()"
								:key="typeKey(rtrn)"
								:names="rtrn.types?.flat()"
								:variable="rtrn.variable"
								:nullable="rtrn.nullable"
							/>
						</template>
					</template>
					<template v-else>
						<Types v-for="rtrn in typedef.returns" :key="typeKey(rtrn)" :names="rtrn" />
					</template>
				</span>
				<TypeLink v-else :type="['void']" />
				<div class="mt-3">
					<p
						v-if="
							(typedef.returns && !Array.isArray(typedef.returns) && typedef.returns.description) ||
							typedef.returnsDescription
						"
						class="noprose"
						v-html="returnDescription"
					></p>
				</div>
			</template>
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
import { usePreferredReducedMotion } from '~/util/ReducedMotion';
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
const returnDescription = computed(() =>
	markdown(
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
		convertLinks(typedef.returns.description ?? typedef.returnsDescription, docs.value, router, route),
	),
);

useHead({
	title: computed(() => `discord.js | ${typedef?.name ?? ''}`),
});

onMounted(() => {
	const containerElement = document.getElementById('container');
	if (containerElement && containerElement.scrollTop > 200) {
		containerElement.scrollTo({ top: 0, behavior: usePreferredReducedMotion.value ? undefined : 'smooth' });
	}
});
</script>
