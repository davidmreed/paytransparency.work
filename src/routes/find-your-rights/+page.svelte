<script lang="ts">
	import { US_REMOTE_LOCALE, OTHER_LOCALE, locales, allLocales, Situation } from '$lib/data';
	import { asQueryString, createQueryStore } from '$lib/URLParamStore';
	import { isValidParams, Params } from '$lib/checking';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	let pageParams = browser ? createQueryStore(Params) : writable(Params.parse({}));

	const locationOptions = Object.keys(locales)
		.sort()
		.map((l) => [l, locales[l].name]);
	const myLocationOptions = [
		['', '--Select--'],
		[OTHER_LOCALE, 'Somewhere else']
	].concat(locationOptions);
	const roleLocationOptions = [
		[OTHER_LOCALE, 'Somewhere else'],
		[US_REMOTE_LOCALE, 'All US (Remote)']
	].concat(locationOptions);

	function handleFind() {
		goto(`/your-rights?${asQueryString($pageParams)}`);
	}

	let canSelectEmployeeInLocation = true;

	$: {
		let companyLocale = allLocales[$pageParams.companyLocation];
		let userLocale = allLocales[$pageParams.userLocation];
		if (companyLocale && userLocale) {
			if (userLocale.isOrContains(companyLocale)) {
				$pageParams.employeeInLocation = true;
				canSelectEmployeeInLocation = false;
			} else {
				canSelectEmployeeInLocation = true;
			}
		}
	}

	$: validParams = isValidParams($pageParams);
</script>

<main>
	<h1>Discover Your Pay Transparency Rights</h1>
	<p>
		PayTransparency.work knows about transparency laws in {Object.keys(locales).length} jurisdictions.
		Some laws may provide you with rights even if you do not live in their jurisdiction. Let's find out
		what rights you have!
	</p>
	<hr class="color-gray-900 p-1" />

	<form class="pb-4">
		<div class="grid grid-cols-1 gap-6">
			<label class="block" for="situation"
				>What's your situation?
				<select
					bind:value={$pageParams.situation}
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
					bind:value={$pageParams.userLocation}
					id="location"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
				>
					{#each myLocationOptions as locale (locale[0])}
						<option value={locale[0]}>{locale[1]}</option>
					{/each}
				</select>
			</label>

			<label class="inline" for="employeeInLocation">
				<input
					type="checkbox"
					bind:checked={$pageParams.employeeInLocation}
					disabled={!canSelectEmployeeInLocation}
					class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50 disabled:bg-gray-400 disabled:hover:bg-gray-400"
				/>
				Does the employer already have any employees in your location?
			</label>

			<label class="block" for="companyLocation"
				>Where is the employer located?
				<aside class="italic text-xs">If you don't know, choose "Somewhere else".</aside>
				<select
					bind:value={$pageParams.companyLocation}
					id="companyLocation"
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
					bind:value={$pageParams.totalEmployees}
				/>
			</label>
			<label class="block" for="roleLocation"
				>Where is the role eligible for hire?
				<aside class="text-xs italic">
					Choose as many as apply. On Linux and Windows, hold <kbd>CONTROL</kbd> to select rows. On
					Mac, use <kbd>COMMAND</kbd>.
				</aside>
				<select
					multiple
					bind:value={$pageParams.roleLocation}
					id="roleLocation"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
				>
					<select value="">All US (Remote)</select>
					{#each roleLocationOptions as locale (locale[0])}
						<option value={locale[0]}>{locale[1]}</option>
					{/each}
				</select>
			</label>
		</div>
		<div class="container mx-auto">
			<input
				disabled={!validParams}
				class="form-input block border-gray-300 focus:border-indigo-300 rounded-md shadow-sm border-gray-300 hover:bg-gray-800 hover:text-white mt-4 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:text-white"
				type="submit"
				on:click|preventDefault={handleFind}
				value="Find Rights"
			/>
			{#if !validParams}
				<span class="text-xs italic">Enter more information to find your rights.</span>
			{/if}
		</div>
	</form>
</main>
