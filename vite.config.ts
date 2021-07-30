import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import Pages from 'vite-plugin-pages';
import ViteComponents from 'vite-plugin-components';
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

export default defineConfig({
	resolve: {
		alias: {
			'~/': `${resolve(__dirname, 'src')}/`,
		},
	},
	define: {
		GIT_COMMIT_HASH: JSON.stringify(execSync('git rev-parse HEAD').toString().trim()),
		PACKAGE_VERSION: JSON.stringify(JSON.parse(readFileSync('package.json', 'utf-8')).version),
		BUILT_AT: JSON.stringify(Date.now()),
	},
	plugins: [
		Vue(),
		Pages(),
		VitePWA({
			srcDir: 'src',
			filename: 'sw.ts',
			base: '/',
			strategies: 'injectManifest',
			registerType: 'autoUpdate',
			manifest: {
				theme_color: '#090a16',
				background_color: '#090a16',
				name: 'Discord.js Docs',
				short_name: 'd.js Docs',
				start_url: '.',
				display: 'standalone',
				description:
					"Discord.js is a powerful Node.js module that allows you to interact with the Discord API very easily. It takes a much more object-oriented approach than most other JS Discord libraries, making your bot's code significantly tidier and easier to comprehend.",
				icons: [
					{
						src: '/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable',
					},
					{
						src: '/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
		}),
		ViteComponents({
			customComponentResolvers: [
				ViteIconsResolver({
					componentPrefix: '',
				}),
			],
		}),
		ViteIcons(),
	],

	optimizeDeps: {
		include: ['vue', 'vue-router', '@vueuse/core'],
		exclude: ['vue-demi'],
	},
});
