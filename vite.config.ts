import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			manifest: {
				name: 'PayTransparency.work',
				short_name: 'PayTransparency.work',
				description:
					'Discover pay transparency laws in states and cities across the US. Learn why companies may have to share a pay range with you, even if you do not live in a transparency state, and find out how to report violations.',
				theme_color: '#1f2937',
				start_url: '/',
				icons: [
					{
						src: 'android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				],
				display: 'minimal-ui'
			},
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
