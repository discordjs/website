<template>
	<div class="grid">
		<div class="overflow-x-auto lg:custom-scroll">
			<div class="relative">
				<pre
					class="my-0 javascript"
				><code v-html="highlight.highlight(code, { language: 'javascript' }).value"></code></pre>
				<button
					ref="copyButton"
					class="
						absolute
						right-0
						top-0
						mt-4
						mr-4
						inline-block
						hover:text-white
						focus:outline-none
						focus-visible:ring-1 focus-visible:ring-gray-200
					"
					aria-label="Copy code"
				>
					<heroicons-outline-clipboard-copy
						v-if="!copied"
						class="fill-current text-gray-700 dark:text-gray-200"
						aria-hidden="true"
						@click="copyCode"
					/>
					<heroicons-outline-clipboard-check
						v-else
						class="fill-current text-discord-green-600 dark:text-discord-green-500"
						aria-hidden="true"
						@click="copyCode"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useTippy } from 'vue-tippy';
import debounce from 'lodash/debounce';
import highlight from 'highlight.js';

const props = defineProps<{ code: string }>();

const copyButton = ref();
const copied = ref(false);
const resetCopied = debounce((hide: () => void) => {
	hide();
	copied.value = false;
}, 1000);

const { show: showTooltip, hide: hideTooltip } = useTippy(copyButton, {
	theme: 'discord',
	content: 'Copied',
	trigger: 'manual',
	hideOnClick: false,
});

const copyCode = async () => {
	try {
		await navigator.clipboard.writeText(props.code);
		showTooltip();
	} catch {}

	copied.value = true;
	resetCopied(hideTooltip);
};
</script>
