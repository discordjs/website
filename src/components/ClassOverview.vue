<template>
	<div class="grid sm:grid-cols-2" :class="events && events.length ? 'md:grid-cols-3' : null">
		<div v-if="visibleProperties && visibleProperties.length">
			<h4>Properties</h4>
			<ul class="no-list">
				<li
					v-for="property in visibleProperties"
					:key="scopedName(property)"
					class="cursor-pointer"
					@click="scrollTo(scopedName(property))"
				>
					<router-link
						:to="{ name: 'docs-source-tag-class-class', query: { scrollTo: scopedName(property) } }"
						class="mr-2"
					>
						{{ property.name }}
					</router-link>
					<span class="text-gray-200 text-sm font-semibold uppercase">
						<span
							v-if="property.scope === 'static'"
							class="inline-flex items-center px-1.5 rounded-md bg-discord-blurple-500"
							>S</span
						>
						<span v-if="property.abstract" class="inline-flex items-center px-1.5 rounded-md bg-discord-blurple-500"
							>A</span
						>
						<span v-if="property.deprecated" class="inline-flex items-center px-1.5 rounded-md bg-discord-red-500"
							>D</span
						>
						<span
							v-if="property.access === 'private'"
							class="inline-flex items-center px-1.5 rounded-md bg-discord-red-500"
							>P</span
						>
					</span>
				</li>
			</ul>
		</div>

		<div v-if="visibleMethods && visibleMethods.length">
			<h4>Methods</h4>
			<ul class="no-list">
				<li
					v-for="method in visibleMethods"
					:key="scopedName(method)"
					class="cursor-pointer"
					@click="scrollTo(scopedName(method))"
				>
					<router-link
						:to="{ name: 'docs-source-tag-class-class', query: { scrollTo: scopedName(method) } }"
						class="mr-2"
					>
						{{ method.name }}
					</router-link>
					<span class="text-gray-200 text-sm font-semibold uppercase">
						<span
							v-if="method.scope === 'static'"
							class="inline-flex items-center px-1.5 rounded-md bg-discord-blurple-500"
							>S</span
						>
						<span v-if="method.abstract" class="inline-flex items-center px-1.5 rounded-md bg-discord-blurple-500"
							>A</span
						>
						<span v-if="method.deprecated" class="inline-flex items-center px-1.5 rounded-md bg-discord-red-500"
							>D</span
						>
						<span
							v-if="method.access === 'private'"
							class="inline-flex items-center px-1.5 rounded-md bg-discord-red-500"
							>P</span
						>
					</span>
				</li>
			</ul>
		</div>

		<div v-if="visibleEvents && visibleEvents.length">
			<h4>Events</h4>
			<ul class="no-list">
				<li
					v-for="event in visibleEvents"
					:key="event.name"
					class="cursor-pointer"
					@click="scrollTo(`e-${event.name}`)"
				>
					<router-link
						:to="{ name: 'docs-source-tag-class-class', query: { scrollTo: `e-${event.name}` } }"
						class="mr-2"
					>
						{{ event.name }}
					</router-link>
					<span
						v-if="event.deprecated"
						class="
							text-gray-200 text-sm
							font-semibold
							uppercase
							inline-flex
							items-center
							px-1.5
							rounded-md
							bg-discord-red-500
						"
						>D</span
					>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

import { scopedName } from '~/util/scopedName';
import { isShowPrivates } from '~/util/showPrivates';

import type {
	DocumentationClassEvent,
	DocumentationClassMethod,
	DocumentationClassProperty,
} from '~/interfaces/Documentation';

const props =
	defineProps<{
		properties?: DocumentationClassProperty[];
		methods?: DocumentationClassMethod[];
		events?: DocumentationClassEvent[];
	}>();

const visibleProperties = computed(() =>
	isShowPrivates.value ? props.properties : props.properties?.filter((prop) => prop.access !== 'private'),
);
const visibleMethods = computed(() =>
	isShowPrivates.value ? props.methods : props.methods?.filter((prop) => prop.access !== 'private'),
);
const visibleEvents = computed(() =>
	isShowPrivates.value ? props.events : props.events?.filter((prop) => prop.access !== 'private'),
);

const scrollTo = (elementName: string) => {
	const element = document.getElementById(`doc-for-${elementName}`);
	element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>
