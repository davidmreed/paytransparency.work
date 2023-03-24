<script lang="ts">
	import { OTHER_LOCALE, type Params, US_REMOTE_LOCALE } from '$lib/checking';
	import Situation from './Situation.svelte';
	import type { z } from 'zod';
	import { data, getFormattedLocale } from '$lib/data';

	export let params: z.infer<typeof Params>;

	function localeName(l: string): string {
		if (l === US_REMOTE_LOCALE) {
			return 'the entire United States';
		} else if (l === OTHER_LOCALE) {
			return 'other locations';
		} else {
			return getFormattedLocale(data[l]);
		}
	}
</script>

<p class="mr-4 ml-4 text-s italic">
	You are located in {data[params.userLocation].state}. You're
	<Situation situation={{ situation: params.situation, requestRequired: false }} />
	in a role with a company based in {data[params.companyLocation]
		.state}{#if params.employeeInLocation}, which already has employees in your location{/if}. The
	company has at least {params.totalEmployees} employee{#if params.totalEmployees !== 1}s{/if}. The
	role can hire in {#each params.roleLocation as roleLocation, i (roleLocation)}
		{localeName(roleLocation)}{#if i < params.roleLocation.length - 1}, {#if i === params.roleLocation.length - 2}and
			{/if}{/if}{/each}.
</p>
