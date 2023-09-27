<script lang="ts">
	import type { Params } from '$lib/checking';

	import SituationDescription from './SituationDescription.svelte';
	import type { z } from 'zod';
	import { locales, OTHER_LOCALE, US_REMOTE_LOCALE } from '$lib/data';

	export let params: z.infer<typeof Params>;

	function localeName(l: string): string {
		if (l === US_REMOTE_LOCALE) {
			return 'the entire United States';
		} else if (l === OTHER_LOCALE) {
			return "a location for which we don't track laws";
		} else {
			return locales[l].name;
		}
	}
</script>

<p class="mr-4 ml-4 text-s italic">
	You are located in {localeName(params.userLocation)}. You're seeking transparency rights that
	would apply
	<SituationDescription
		situation={{ situation: params.situation, requestRequired: false }}
		showIcon={false}
	/>. The company is based in {localeName(params.companyLocation)}{#if params.employeeInLocation},
		and already has employees in your location{/if}. {#if params.officeSupervisorLocation !== OTHER_LOCALE}The
		role reports to an office or non-remote supervisor in {localeName(
			params.officeSupervisorLocation
		)}.{/if} The company has at least {params.totalEmployees}
	employee{#if params.totalEmployees !== 1}s{/if}. {#if params.roleLocation.length}The role can hire
		in {#each params.roleLocation as roleLocation, i (roleLocation)}
			{localeName(roleLocation)}{#if i < params.roleLocation.length - 1}, {#if i === params.roleLocation.length - 2}and
				{/if}{/if}{/each}.{/if}
</p>
