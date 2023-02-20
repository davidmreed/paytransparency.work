<script lang="ts">
	import { data, type LocalityData } from '$lib/data';

	let locales = Object.keys(data).map((d) => ({ locale: d, ...data[d] }));
</script>

<h1>Discover Pay Transparency Rights</h1>
<ul>
	{#each locales as locale (locale.locale)}
		<li><a href={`/locations/${locale.locale}`}>{locale.state}</a></li>
	{/each}
</ul>
