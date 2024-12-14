<script lang="ts">
	import { findMatchingLaws, isValidParams, Params, type MatchParameters } from '$lib/checking';
	import CheckSituation from '$lib/CheckSituation.svelte';
	import MatchTable from '$lib/MatchTable.svelte';
	import SiteName from '$lib/SiteName.svelte';
	import { createUseQueryParams } from 'svelte-query-params';
	import { sveltekit } from 'svelte-query-params/adapters/sveltekit';
	import { page } from '$app/stores';
	import { Situation } from '$lib/data';
	import { onMount } from 'svelte';

	let params: MatchParameters = $state({
		situation: Situation.Application,
		userLocation: '',
		companyLocation: '',
		officeSupervisorLocation: '',
		employeeInLocation: false,
		totalEmployees: 1,
		roleLocation: []
	});

	let validParams = $derived(isValidParams(params));
	let matches = $derived(findMatchingLaws(params));
	let geoMatches = $derived(matches.filter((m) => m.isGeoMatch));
	let nonGeoMatches = $derived(matches.filter((m) => !m.isGeoMatch));

	onMount(() => {
		[params] = createUseQueryParams(Params, { adapter: sveltekit({ replace: true }) })($page.url);
	});
</script>

<svelte:head>
	<title>Your Pay Transparency Rights</title>
</svelte:head>

<h2 class="pb-0">Your Pay Transparency Rights</h2>
<aside class="italic text-xs pb-6">
	This analysis is based on a summary of laws by a non-attorney. Review laws in detail before taking
	action, or retain an attorney in your area.
</aside>

{#if validParams}
	<p>You shared the following information about your situation.</p>
	<CheckSituation {params} />
{:else}
	<p>
		It looks like you didn't share enough information about your situation. <a
			href="/find-your-rights">Find Your Rights</a
		>.
	</p>
{/if}
{#if geoMatches.length}
	<hr />
	<h3 class="pb-2 pt-4">Strong Matches</h3>
	<p>
		<SiteName /> believes the following laws are likely to provide transparency rights in your situation,
		based on your location and the location of the company.
	</p>
	<MatchTable matches={geoMatches} />
{:else if validParams}
	<p>
		Unfortunately, <SiteName /> could not find any laws in your location or the company's location that
		provide transparency rights in your situation.
	</p>
{/if}

{#if nonGeoMatches.length}
	<hr />
	<h3 class="pb-2 pt-4">Weaker Matches</h3>
	<p>
		<SiteName /> found potential rights under the laws of jurisdictions outside of your location and
		the location of the company. It's possible that these laws could provide some transparency rights,
		but we don't have enough information to assess them. Carefully review to determine if they apply
		to your situation.
	</p>
	<MatchTable matches={nonGeoMatches} />
{/if}
