import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import inlineSvg from '@svelte-put/inline-svg/preprocessor';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		inlineSvg(
			{
				directories: ['static/states', 'static/icons'],
				attributes: {}
			},
			{
				inlineSrcAttributeName: 'data-inline-src',
				keepInlineSrcAttribute: false
			}
		),
		vitePreprocess()
	],

	kit: {
		adapter: adapter(),
		serviceWorker: {
			register: false
		}
	}
};

export default config;
