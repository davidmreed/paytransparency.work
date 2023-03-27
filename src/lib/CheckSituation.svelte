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
			return 'other locations';
		} else {
			return locales[l].name;
		}
	}
</script>

<p class="mr-4 ml-4 text-s italic">
	You are located in {locales[params.userLocation].name}. You're seeking transparency rights that
	would apply
	<SituationDescription
		situation={{ situation: params.situation, requestRequired: false }}
		showIcon={false}
	/>. The company is based in {locales[params.companyLocation].name}{#if params.employeeInLocation},
		and already has employees in your location{/if}. The company has at least {params.totalEmployees}
	employee{#if params.totalEmployees !== 1}s{/if}. {#if params.roleLocation}The role can hire in {#each params.roleLocation as roleLocation, i (roleLocation)}
			{localeName(roleLocation)}{#if i < params.roleLocation.length - 1}, {#if i === params.roleLocation.length - 2}and
				{/if}{/if}{/each}.{/if}
</p>
