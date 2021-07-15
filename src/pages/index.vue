<template>
	<div class="bg-discord-blurple-500 py-20">
		<div class="max-w-3xl sm:mx-auto text-center px-8 sm:px-16 flex flex-col gap-10 md:px-12">
			<Logo class="filter drop-shadow-lg my-6" />
			<InstallButton />
		</div>
	</div>

	<div
		class="
			prose prose-discord
			dark:prose-light
			lg:prose-lg
			px-6
			mx-auto
			pb-8
			w-full
			xl:grid xl:grid-cols-2 xl:gap-x-12 xl:max-w-7xl
		"
	>
		<div>
			<h2>About</h2>
			<h3>Imagine a bot</h3>
			<p>
				discord.js is a powerful
				<a href="https://nodejs.org" target="_blank" rel="noopener"
					>Node.js <heroicons-outline-external-link class="h-5 w-5 inline-block mb-1" aria-hidden="true"
				/></a>
				module that allows you to interact with the
				<a href="https://discordapp.com/developers/docs/intro" target="_blank" rel="noopener"
					>Discord API <heroicons-outline-external-link class="h-5 w-5 inline-block mb-1" aria-hidden="true"
				/></a>
				very easily. It takes a much more object-oriented approach than most other JS Discord libraries, making your
				bot's code significantly tidier and easier to comprehend.
			</p>
			<p>
				Usability, consistency, and performance are key focuses of discord.js, and it also has nearly 100% coverage of
				the Discord API. It receives new Discord features shortly after they arrive in the API.
			</p>
		</div>
		<div>
			<h2>Example</h2>
			<Codeblock :code="exampleCode" />
		</div>
		<div>
			<h2>Why DiscordJS?</h2>
			<ul>
				<li>Object-oriented</li>
				<li>Speedy and efficient</li>
				<li>Feature-rich</li>
				<li>Flexible</li>
				<li>100% Promise-based</li>
			</ul>
		</div>
		<div>
			<h2>Statistics</h2>
			<Stats />
			<p class="text-center">... and growing!</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { stripIndent } from 'common-tags';

import { useStore } from '~/store';
import MainSource from '~/data/MainSource';

import Logo from '~/components/Logo.vue';
import InstallButton from '~/components/InstallButton.vue';
import Codeblock from '~/components/Codeblock.vue';
import Stats from '~/components/Stats.vue';

const store = useStore();

const exampleCode = ref(stripIndent`
	const Discord = require('discord.js');
	const client = new Discord.Client();

	client.on('ready', () => {
		console.log(\`Logged in as \${client.user.tag}!\`);
	});

	client.on('interactionCreate', async interaction => {
		if (!interaction.isCommand()) return;
		if (interaction.commandName === 'ping') {
			await interaction.reply('Pong!');
		}
	});

	client.login('token');`);

const docs = computed(() => store.state.docs);

if (!docs.value) {
	void store.dispatch('fetchDocs', { inputSource: MainSource });
	void store.dispatch('fetchTags', { currentSource: MainSource });
}
</script>
