<script lang="ts">
	import { inlineSvg } from '@svelte-put/inline-svg';
	import { getFormattedLocale, type LocalityData } from './data';

	export let locale: LocalityData;
	const svgPath = `/svgs/${locale.stateCode}.svg`;
	const localeName = getFormattedLocale(locale);
</script>

<svg use:inlineSvg={svgPath} />
