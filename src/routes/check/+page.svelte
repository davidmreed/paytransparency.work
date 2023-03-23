<script lang="ts">
	import { data, getFormattedLocale } from '$lib/data';
	import { asQueryString, createQueryStore } from '$lib/URLParamStore';
	import { Params, Situation, US_REMOTE_LOCALE, OTHER_LOCALE } from '$lib/checking';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	let pageParams = browser ? createQueryStore(Params) : writable(Params.parse({}));

	const locationOptions = Object.keys(data)
		.sort()
		.map((l) => [l, getFormattedLocale(data[l])]);
	const myLocationOptions = [
		['', '--Select--'],
		[OTHER_LOCALE, 'Somewhere else']
	].concat(locationOptions);
	const roleLocationOptions = [
		[OTHER_LOCALE, 'Somewhere else'],
		[US_REMOTE_LOCALE, 'All US (Remote)']
	].concat(locationOptions);

	function handleFind() {
		goto(`/rights?${asQueryString($pageParams)}`);
	}
</script>

<main>
	<h1>Discover Pay Transparency Rights for Your Situation</h1>
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
					class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
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
		<input type="submit" on:click|preventDefault={handleFind} title="Find Rights" />
	</form>
</main>
