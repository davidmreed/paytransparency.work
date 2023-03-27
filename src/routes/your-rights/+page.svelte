<script lang="ts">
	import { createQueryStore } from '$lib/URLParamStore';
	import { findMatchingLaws, isValidParams, Params, type Match } from '$lib/checking';
	import CheckSituation from '$lib/CheckSituation.svelte';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import MatchTable from '$lib/MatchTable.svelte';
	import SiteName from '$lib/SiteName.svelte';

	let pageParams = browser ? createQueryStore(Params) : writable(Params.parse({}));

	let geoMatches: Match[] = [];
	let nonGeoMatches: Match[] = [];

	$: validParams = isValidParams($pageParams);
	$: {
		const matches = findMatchingLaws($pageParams);

		geoMatches = matches.filter((m) => m.isGeoMatch);
		nonGeoMatches = matches.filter((m) => !m.isGeoMatch);
	}
</script>

<h2 class="pb-0">Your Disclosure Rights</h2>
<aside class="italic text-xs pb-6">
	This analysis is based on a summary of laws by a non-attorney. Review laws in detail before taking
	action, or retain an attorney in your area.
</aside>

{#if validParams}
	<p>You shared the following information about your situation.</p>
	<CheckSituation params={$pageParams} />
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
{:else}
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
		the location of the company. Depending on the company's presence and the availability of the role
		in these areas, it's possible that the laws of these jurisdictions could provide some transparency
		rights.
	</p>
	<p>
		Carefully review the transparency protections in these jurisdictions to determine if they apply
		to your situation.
	</p>
	<MatchTable matches={nonGeoMatches} />
{/if}
