<script lang="ts">
	import type { Match } from './checking';
	import GreenCheckIcon from './GreenCheckIcon.svelte';
	import RedPlusIcon from './RedPlusIcon.svelte';
	import StateIcon from './StateIcon.svelte';

	export let matches: Match[];
</script>

<div class="grid md:grid-cols-2 grid-cols-1">
	{#each matches as match}
		<div class="p-6 justify-left text-left">
			<p>
				<a href={`/locations/${match.locale.id}`}>
					<span class="float-right"><StateIcon locale={match.locale} /></span>
					<strong>{match.locale.name}</strong></a
				>
				requires the disclosure of
			</p>
			<ul class="pb-2 indent">
				{#if match.locale.what.salary}
					<li>
						<GreenCheckIcon />
						the <strong>pay range</strong>
					</li>
				{/if}
				{#if match.locale.what.benefits}
					<li>
						<RedPlusIcon />
						the <strong>benefits</strong>
					</li>
				{/if}
			</ul>
			{#if match.minEmployeesInLocale}if the company has at least {match.minEmployeesInLocale} employee{#if match.minEmployeesInLocale > 1}s{/if}
				located there.{:else if match.locale.who.officeInLocale}if the company has a presence there.{/if}
		</div>
	{/each}
</div>
