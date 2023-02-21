<script lang="ts">
	import { data } from '$lib/data';
	let locales = Object.keys(data).map((d) => ({ locale: d, ...data[d] }));
</script>

<svelte:head>
	<title>Discover Pay Transparency Laws</title>
</svelte:head>

<h1>Discover Pay Transparency Laws</h1>
<p>PayTransparency.work covers pay transparency laws in the United States. Discover pay transparency rules by state and city below. Not in an area with a disclosure law? You may still benefit from laws in states like California and Washington, which require multi-state employers to disclose in many situations.</p> 
<div class="flex flex-row flex-wrap">
	{#each locales as locale (locale.locale)}
		<div class="basis-1/3 sm:basis-1/2">
			let svgPath = `/svgs/${data.stateCode}.svg`;
	<img alt={locale} src={svgPath} class="float-right" />

			<a href={`/locations/${locale.locale}`}>{#if locale.city}{locale.city}, {/if}{locale.state}</a>
		</div>
	{/each}
</div>