<template>
	<code class="text-gray-200 bg-discord-blurple-560 p-4 md:text-lg mx-auto rounded-md shadow flex items-center"
		><span class="hover:text-white mr-2">npm install discord.js</span>
		<button ref="copyButton" class="focus:outline-none" aria-label="Copy install command">
			<heroicons-outline-clipboard-copy
				v-if="!copied"
				class="inline-block fill-current text-gray-200 cursor-pointer hover:text-white mb-1"
				aria-hidden="true"
				@click="copyInstallCmd"
			/>
			<heroicons-outline-clipboard-check
				v-else
				class="inline-block fill-current text-discord-green-500 cursor-pointer mb-1"
				aria-hidden="true"
				@click="copyInstallCmd"
			/>
		</button>
	</code>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce';
import { ref } from 'vue';
import { useTippy } from 'vue-tippy';

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

const copyInstallCmd = async () => {
	try {
		await navigator.clipboard.writeText('npm install discord.js');
		showTooltip();
	} catch {}

	copied.value = true;
	resetCopied(hideTooltip);
};
</script>
