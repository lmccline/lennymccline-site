// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import figure from './src/plugins/satteri-figure.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://lennymccline.com',
	integrations: [sitemap()],
	markdown: {
		processor: satteri({
			hastPlugins: [figure],
		}),
	},
});
