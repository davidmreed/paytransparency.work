import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { inlineSvg } from '@svelte-put/preprocess-inline-svg/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		inlineSvg([
			{
				directories: 'static/svgs',
				attributes: {},
			}
	  ]),
	  vitePreprocess()
	],
	
	kit: {
		adapter: adapter()
	}
};

export default config;
