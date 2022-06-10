<template>
	<div class="mx-auto py-16 px-4 sm:px-8 lg:py-8 w-full">
		<SourceButton class="float-right mt-2" :meta="fn?.meta" />

		<div class="prose prose-discord dark:prose-light break-words-legacy mx-auto max-w-4xl lg:max-w-full">
			<h1 :id="`doc-for-${fn?.name}`">
				{{ fn?.name }}
			</h1>

			<p v-if="fn?.description" v-html="description"></p>
			<See v-if="fn?.see?.length" :see="fn?.see" />

			<template v-if="fn?.params && fn?.params.length">
				<h2>Parameters</h2>
				<ParameterTable :parameters="fn.params" />
			</template>

			<template v-if="fn?.returns">
				<h2>Returns</h2>
				<span v-if="fn.returns && Array.isArray(fn.returns)">
					<template v-if="docs!.meta!.format >= 30">
						<template v-if="Array.isArray(fn.returns[0])">
							<Types v-for="rtrn in fn.returns.flat()" :key="typeKey(rtrn)" :names="rtrn" />
						</template>
						<template v-else>
							<Types
								v-for="rtrn in fn.returns.flat()"
								:key="typeKey(rtrn)"
								:names="rtrn.types?.flat()"
								:variable="rtrn.variable"
								:nullable="rtrn.nullable"
							/>
						</template>
					</template>
					<template v-else>
						<Types v-for="rtrn in fn.returns" :key="typeKey(rtrn)" :names="rtrn" />
					</template>
				</span>
				<TypeLink v-else :type="['void']" />
				<div class="mt-3">
					<p
						v-if="(fn.returns && !Array.isArray(fn.returns) && fn.returns.description) || fn.returnsDescription"
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

const fn = docs.value?.functions?.find((fn) => fn.name === route.params.function);

// @ts-expect-error
const description = computed(() => markdown(convertLinks(fn?.description, docs.value, router, route)));
const returnDescription = computed(() =>
	markdown(
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
		convertLinks(fn.returns.description ?? fn.returnsDescription, docs.value, router, route),
	),
);

useHead({
	title: computed(() => `discord.js | ${fn?.name ?? ''}`),
});

onMounted(() => {
	const containerElement = document.getElementById('container');
	if (containerElement && containerElement.scrollTop > 200) {
		containerElement.scrollTo({ top: 0, behavior: usePreferredReducedMotion.value ? undefined : 'smooth' });
	}
});
</script>
