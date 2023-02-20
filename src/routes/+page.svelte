<script lang="ts">
	import { data } from '$lib/data';
	let locales = Object.keys(data).map((d) => ({ locale: d, ...data[d] }));
</script>

<svelte:head>
	<title>Discover Pay Transparency Laws</title>
</svelte:head>

<h1>Discover Pay Transparency Laws</h1>
<ul>
	{#each locales as locale (locale.locale)}
		<li><a href={`/locations/${locale.locale}`}>{#if locale.city}{locale.city},{/if}{locale.state}</a></li>
	{/each}
</ul>
