<script lang="ts">
	import {
		US_REMOTE_LOCALE,
		CA_REMOTE_LOCALE,
		OTHER_LOCALE,
		locales,
		allLocales,
		Situation
	} from '$lib/data';
	import { isValidParams, Params, type MatchParameters } from '$lib/checking';
	import { goto } from '$app/navigation';
	import SiteName from '$lib/SiteName.svelte';

	import { createUseQueryParams, type QueryHelpers } from 'svelte-query-params';
	import { sveltekit } from 'svelte-query-params/adapters/sveltekit';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const locationOptions = Object.keys(locales)
		.sort()
		.map((l) => [l, locales[l].name]);
	const myLocationOptions = [
		['', '--Select--'],
		[OTHER_LOCALE, 'Somewhere else']
	].concat(locationOptions);
	const roleLocationOptions = [
		[OTHER_LOCALE, 'Somewhere else'],
		[US_REMOTE_LOCALE, 'All US (Remote)'],
		[CA_REMOTE_LOCALE, 'All Canada (Remote)']
	].concat(locationOptions);

	let params: MatchParameters = $state({
		situation: Situation.Application,
		userLocation: '',
		companyLocation: '',
		officeSupervisorLocation: '',
		employeeInLocation: false,
		totalEmployees: 1,
		roleLocation: []
	});
	let helpers: QueryHelpers<MatchParameters> | undefined;
	let validParams = $derived(params ? isValidParams(params) : false);

	let companyLocale = $derived(allLocales[params.companyLocation]);
	let userLocale = $derived(allLocales[params.userLocation]);
	let canSelectEmployeeInLocation = $derived(
		!(companyLocale && userLocale && userLocale.isOrContains(companyLocale))
	);

	function handleFind(event: Event) {
		event.preventDefault();
		params.employeeInLocation = !canSelectEmployeeInLocation || params.employeeInLocation;
		if (helpers) {
			goto(`/your-rights${helpers.search}`);
		}
	}

	onMount(() => {
		[params, helpers] = createUseQueryParams(Params, { adapter: sveltekit({ replace: true }) })(
			$page.url
		);
	});
</script>

<svelte:head>
	<title>Discover Your Pay Transparency Rights</title>
</svelte:head>

<main>
	<h1>Discover Your Pay Transparency Rights</h1>
	<p>
		<SiteName /> knows about transparency laws in {Object.keys(locales).length} jurisdictions. Some laws
		may provide you with rights even if you do not live in their jurisdiction. Let's find out what rights
		you have!
	</p>
	<hr class="color-gray-900 p-1" />

	<form class="pb-4">
		<div class="grid grid-cols-1 gap-6">
			<label class="block" for="situation"
				>What's your situation?
				<select
					bind:value={params.situation}
					id="situation"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
				>
					<option value={Situation.Interested}>I'm interested in an open role</option>
					<option value={Situation.Application}>I have applied for an open role</option>
					<option value={Situation.Interview}>I have had an interview for an open role</option>
					<option value={Situation.Offer}>I have received an offer</option>
					<option value={Situation.Hire}>I have just been hired</option>
					<option value={Situation.Employed}>I am currently employed</option>
				</select>
			</label>

			<label class="block" for="location"
				>Where are you located?
				<select
					bind:value={params.userLocation}
					id="location"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
				>
					{#each myLocationOptions as locale (locale[0])}
						<option value={locale[0]}>{locale[1]}</option>
					{/each}
				</select>
			</label>

			{#if params.situation !== Situation.Employed}
				<label class="inline" for="employeeInLocation">
					<input
						type="checkbox"
						bind:checked={params.employeeInLocation}
						disabled={!canSelectEmployeeInLocation}
						class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50 disabled:bg-gray-400 disabled:hover:bg-gray-400"
					/>
					Does the employer already have any employees in your location?
				</label>
			{/if}

			<label class="block" for="companyLocation"
				>Where is the employer located?
				<aside class="italic text-xs">If you don't know, choose "Somewhere else".</aside>
				<select
					bind:value={params.companyLocation}
					id="companyLocation"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
				>
					{#each myLocationOptions as locale (locale[0])}
						<option value={locale[0]}>{locale[1]}</option>
					{/each}
				</select>
			</label>
			<label class="block" for="officeSupervisorLocation"
				>Where is your office or non-remote supervisor located?
				<aside class="italic text-xs">
					If you don't know, or if your supervisor works remotely, choose "Somewhere else".
				</aside>
				<select
					bind:value={params.officeSupervisorLocation}
					id="officeSupervisorLocation"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
				>
					{#each myLocationOptions as locale (locale[0])}
						<option value={locale[0]}>{locale[1]}</option>
					{/each}
				</select>
			</label>

			<label class="block" for="totalEmployees">
				How many total employees does the employer have?
				<aside class="text-xs italic">
					This is typically only relevant under 15 total employees.
				</aside>
				<input
					class="mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
					type="number"
					bind:value={params.totalEmployees}
				/>
			</label>
			{#if params.situation !== Situation.Employed}
				<label class="block" for="roleLocation"
					>Where is the role eligible for hire?
					<aside class="text-xs italic">
						Choose as many as apply. On Linux and Windows, hold <kbd>CONTROL</kbd> to select rows.
						On Mac, use <kbd>COMMAND</kbd>.
					</aside>
					<select
						multiple
						bind:value={params.roleLocation}
						id="roleLocation"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
					>
						{#each roleLocationOptions as locale (locale[0])}
							<option value={locale[0]}>{locale[1]}</option>
						{/each}
					</select>
				</label>
			{/if}
		</div>
		<div class="container mx-auto">
			<input
				disabled={!validParams}
				class="form-input block border-gray-300 focus:border-indigo-300 rounded-md shadow-sm border-gray-300 hover:bg-gray-800 hover:text-white mt-4 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:text-white"
				type="submit"
				onclick={handleFind}
				value="Find Rights"
			/>
			{#if !validParams}
				<span class="text-xs italic">Enter more information to find your rights.</span>
			{/if}
		</div>
	</form>
</main>
