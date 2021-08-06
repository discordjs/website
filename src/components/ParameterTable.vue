<template>
	<div class="grid">
		<div class="overflow-x-auto lg:custom-scroll border dark:border-gray-600 rounded-md mt-2 mb-8">
			<table class="!text-base !text-center !my-0 min-w-max xl:min-w-0">
				<thead class="bg-discord-blurple-500 !text-gray-200">
					<tr class="!uppercase">
						<th class="!p-4 w-96">Parameter</th>
						<th class="!p-4 w-48">Type</th>
						<th v-if="optional" class="!p-4 w-40">Optional</th>
						<th v-if="optional" class="!p-4 w-40">Default</th>
						<th class="!p-4 w-96">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="parameter in parameters" :key="parameter.name">
						<td class="!pl-2.5 !py-5">{{ parameter.name }}</td>
						<td class="!py-5">
							<div>
								<Types
									v-for="type in parameter.type"
									:key="typeKey(type)"
									:names="type"
									:variable="parameter.variable"
									:nullable="parameter.nullable"
								/>
							</div>
						</td>
						<td v-if="optional" class="!py-5">
							<span class="sr-only">True</span>
							<heroicons-outline-check v-if="parameter.optional" class="h-5 w-5 mx-auto" aria-hidden="true" />
						</td>
						<td v-if="optional" class="!py-5">
							<em v-if="parameter.optional && typeof parameter.default === 'undefined'">none</em>
							<span v-else v-html="parameterDefault(parameter)"></span>
						</td>
						<td class="!pr-2.5 !py-0" v-html="parameterDescription(parameter)"></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useStore } from '~/store';
import { markdown } from '~/util/markdown';
import { convertLinks } from '~/util/convertLinks';
import { typeKey } from '~/util/typeKey';

import Types from '~/components/Types.vue';

import type { ParameterUnion } from '~/interfaces/Documentation';

const props = defineProps<{ parameters: ParameterUnion[] }>();

const router = useRouter();
const route = useRoute();
const store = useStore();

const docs = computed(() => store.state.docs);
const optional = computed(() => props.parameters.some((parameter) => parameter.optional));

const parameterDescription = (parameter: any) =>
	// @ts-expect-error
	markdown(convertLinks(parameter.description, docs.value, router, route));
const parameterDefault = (parameter: ParameterUnion) => (parameter.optional ? `<code>${parameter.default}</code>` : '');
</script>

<style>
table tr:first-child th:first-child {
	border-top-left-radius: theme('borderRadius.md');
}

table tr:first-child th:last-child {
	border-top-right-radius: theme('borderRadius.md');
}

table tr:last-child td:first-child {
	border-bottom-left-radius: theme('borderRadius.md');
}

table tr:last-child td:first-child {
	border-bottom-right-radius: theme('borderRadius.md');
}
</style>
