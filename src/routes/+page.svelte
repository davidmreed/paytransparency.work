<script lang="ts">
	import { locales } from '$lib/data';
	import SiteName from '$lib/SiteName.svelte';
	import StateIcon from '$lib/StateIcon.svelte';

	let sortedLocales = Object.values(locales).sort((a, b) => {
		return a.id.localeCompare(b.id);
	});
</script>

<svelte:head>
	<title>Discover Pay Transparency Laws</title>
</svelte:head>

<h1>Discover Pay Transparency Laws</h1>
<p>
	<SiteName /> covers pay transparency and disclosure laws in the United States. Discover pay transparency
	rules by state and city below.
</p>
<p>
	Not in an area with a disclosure law? You may still benefit from laws in states like California
	and Washington, which require multi-state employers to disclose in many situations &mdash; even if
	you don't live there.
</p>
<p class="justify-center"><a href="/find-your-rights">Find Your Transparency Rights</a></p>
<div class="flex flex-col sm:flex-row flex-wrap justify-center">
	{#each sortedLocales as locale (locale.id)}
		<div class="p-6 grow justify-center text-center">
			<a href={`/locations/${locale.id}`}>
				<div class="mx-auto">
					<StateIcon {locale} />
				</div>
				{locale.name}
			</a>
		</div>
	{/each}
</div>
