<script lang="ts">
	import { data } from '$lib/data';
	let locales = Object.keys(data)
		.map((d) => ({ locale: d, ...data[d] }))
		.sort((a, b) => {
			if (a.city && !b.city) {
				return 1;
			} else if (!a.city && b.city) {
				return -1;
			} else {
				return a.state.localeCompare(b.state);
			}
		});
</script>

<svelte:head>
	<title>Discover Pay Transparency Laws</title>
</svelte:head>

<h1>Discover Pay Transparency Laws</h1>
<p>
	PayTransparency.work covers pay transparency and disclosure laws in the United States. Discover
	pay transparency rules by state and city below.
</p>
<p>
	Not in an area with a disclosure law? You may still benefit from laws in states like California
	and Washington, which require multi-state employers to disclose in many situations &mdash; even if
	you don't live there.
</p>
<div class="flex flex-col sm:flex-row flex-wrap justify-center">
	{#each locales as locale (locale.locale)}
		<div class="p-6 grow justify-center text-center">
			<a href={`/locations/${locale.locale}`}>
				<img alt={locale.locale} src={`svgs/${locale.stateCode}.svg`} class="mx-auto" />

				{#if locale.city}{locale.city}, {locale.stateCode}{:else}{locale.state}{/if}</a
			>
		</div>
	{/each}
</div>
