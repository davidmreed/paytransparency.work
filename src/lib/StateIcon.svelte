<script lang="ts">
	import { inlineSvg } from '@svelte-put/inline-svg';
	import type { Locale } from './data';

	export let locale: Locale;
	const svgPath = `/svgs/${locale.stateCode}.svg`;
</script>

<svg use:inlineSvg={svgPath} />
