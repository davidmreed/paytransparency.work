<script lang="ts">
	import type { MatchParameters } from '$lib/checking';

	import SituationDescription from './SituationDescription.svelte';
	import { CA_REMOTE_LOCALE, locales, OTHER_LOCALE, US_REMOTE_LOCALE } from '$lib/data';

	interface Props {
		params: MatchParameters;
	}

	let { params }: Props = $props();
	let {
		situation,
		userLocation,
		companyLocation,
		employeeInLocation,
		officeSupervisorLocation,
		totalEmployees,
		roleLocation
	} = $derived(params);

	function localeName(l: string): string {
		if (l === US_REMOTE_LOCALE) {
			return 'the entire United States';
		} else if (l === CA_REMOTE_LOCALE) {
			return 'all of Canada';
		} else if (l === OTHER_LOCALE) {
			return "a location for which we don't track laws";
		} else {
			return locales[l].name;
		}
	}

	function localeNameList(l: string[]): string {
		let names = l.map(localeName);
		if (names.length === 1) {
			return names[0];
		} else if (names.length === 2) {
			return names.join(' and ');
		} else {
			return [names.slice(0, -1).join(', '), names.slice(-1)[0]].join(', and ');
		}
	}
</script>

<p class="mr-4 ml-4 text-s italic">
	You are located in {localeName(userLocation)}. You're seeking transparency rights that would apply
	<SituationDescription
		situation={{ situation: situation, requestRequired: false }}
		showIcon={false}
	/>. The company is based in {localeName(companyLocation)}{#if employeeInLocation}, and already has
		employees in your location{/if}. {#if officeSupervisorLocation !== OTHER_LOCALE}The role reports
		to an office or non-remote supervisor in {localeName(officeSupervisorLocation)}.{/if} The company
	has at least {totalEmployees}
	employee{#if totalEmployees !== 1}s{/if}. {#if roleLocation.length}The role can hire in {localeNameList(
			roleLocation
		)}.{/if}
</p>
