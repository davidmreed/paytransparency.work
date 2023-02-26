<script lang="ts">
	import { data, getFormattedLocale, type LocalityData, type WhatDisclosure } from '$lib/data';

	const US_REMOTE_LOCALE = 'us';
	const OTHER_LOCALE = 'other';
	// TODO: sort these locales.
	const locationOptions = Object.keys(data).map((l) => [l, getFormattedLocale(data[l])]);
	const myLocationOptions = [
		['', '--Select--'],
		[OTHER_LOCALE, 'Somewhere else']
	].concat(locationOptions);
	const roleLocationOptions = [
		[OTHER_LOCALE, 'Somewhere else'],
		[US_REMOTE_LOCALE, 'All US (Remote)']
	].concat(locationOptions);

	const isOrInsideLocale = (a: LocalityData, b: LocalityData) =>
		(a.state === b.state && a.city === b.city) || (a.state === b.state && !b.city);

	enum Situation {
		Interested,
		Application,
		Interview,
		Offer,
		Hire,
		Employed
	}

	interface Match {
		localeId: string;
		localeData: LocalityData;
		earliestDisclosurePoint: Situation;
		minEmployeesInLocale?: number;
		what: WhatDisclosure;
	}

	let matches: Match[] = [];
	let situation: Situation = Situation.Interested;
	let location: string = '';
	let companyLocation: string = '';
	let roleLocation: string[] = [];
	let employeeInLocation = false;
	let totalEmployees: number;

	const shimDisclosurePoints = (d: LocalityData): Situation[] => {
		let sits = [];
		if (d.when.inPosting) {
			sits.push(Situation.Interested);
		}
		if (d.when.onApplicantRequest) {
			sits.push(Situation.Application);
		}
		if (d.when.afterInterview) {
			sits.push(Situation.Interview);
		}
		if (d.when.onOffer) {
			sits.push(Situation.Offer);
		}
		if (d.when.onHire) {
			sits.push(Situation.Hire);
		}
		if (d.when.onExistingEmployeeRequest) {
			sits.push(Situation.Employed);
		}

		return sits.sort();
	};

	$: {
		// Matching against rules is tricky because so many locales come into play.

		// Take, for example, a company based in California, which is hiring a US Remote role.
		// If the company has more than 15 total employees (anywhere), California's rules apply.
		// If the company already has at least one employee in Colorado, Colorado's rules apply.
		// If the company already has 15 employees in Toledo, Toledo's rules apply.
		// ... and so on.

		// This can produce the need for a user to input a lot of data they're unlikely to have
		// about the company's employment base, or generate a lot of low-quality matches.

		// We handle this heuristically by sorting for the matches that are most clear-cut first:
		// We assume the employer has at least one employee in the location that the user
		// indicates is the company location. If that location is also a hireable location,
		// some of the strongest laws (e.g., Colorado) apply immediately. If the company has a total
		// of 15 employees, anywhere, Washington and California kick in at the same point.

		// Once we identify those most-likely, most-actionable matches, we proceed to match against
		// less-likely candidates. We show those to the user but highlight the strongest matches
		// first.

		// We also have to be careful to handle sub-locations - if the user selects New York City,
		// for example, after New York State's law goes into effect, we need to evaluate against both.

		matches = [];
		// TODO: handle "employed" disclosure point differently.

		if (location && companyLocation && roleLocation.length && totalEmployees) {
			const companyLocale = data[companyLocation];
			const userLocale = data[location];

			for (const l of Object.keys(data)) {
				const thisLocale = data[l];
				const disclosureSituations = shimDisclosurePoints(thisLocale);

				// Would this locality's disclosure rule apply to the user's situation?
				const situationMatch = situation >= disclosureSituations[0];
				// Is this locality either the user's location or the company's?
				// (A geographic match makes the fit easier to evaluate).
				const geographicMatch =
					isOrInsideLocale(companyLocale, thisLocale) ||
					(isOrInsideLocale(userLocale, thisLocale) &&
						(thisLocale.who.minEmployeesInLocale || 0 <= 1) &&
						employeeInLocation);
				// Do we have a match on the total number of employees?
				const employeeCountMatch =
					!thisLocale.who.minEmployees || thisLocale.who.minEmployees <= totalEmployees;
				// Is this actually a hireable locale?
				const isEligibleHireLocale =
					roleLocation.filter(
						(eachLocale) =>
							eachLocale === US_REMOTE_LOCALE ||
							(eachLocale !== OTHER_LOCALE && isOrInsideLocale(thisLocale, data[eachLocale]))
					).length > 0;

				// TODO: don't include the user's own locale if locale-employee minimum not met.
				if (situationMatch && employeeCountMatch && isEligibleHireLocale) {
					let minEmployees = geographicMatch ? 0 : thisLocale.who.minEmployeesInLocale || 0;
					matches.push({
						localeId: l,
						localeData: data[l],
						what: thisLocale.what,
						minEmployeesInLocale: minEmployees,
						earliestDisclosurePoint: disclosureSituations[0]
					});
				}
			}

			const sortByBoolean = (a: boolean, b: boolean) => (a !== b ? (a ? -1 : 1) : 0);
			const sortByCriteria = (criteria) => {
				return function (a, b) {
					for (let criterion of criteria) {
						let result = criterion(a, b);
						if (result !== 0) {
							return result;
						}
						return 0;
					}
				};
			};

			// Sort matches with the best up front.
			matches.sort(
				sortByCriteria([
					// Sort those that are equal to either the user or employer location.
					(a, b) =>
						sortByBoolean(
							isOrInsideLocale(a.localeData, companyLocale) ||
								isOrInsideLocale(a.localeData, userLocale),
							isOrInsideLocale(b.localeData, companyLocale) ||
								isOrInsideLocale(b.localeData, userLocale)
						),
					// Then, sort those that disclose more before those that disclose less.
					(a, b) => sortByBoolean(a.what.benefits, b.what.benefits),
					// Then, sort those that do not require a minimum local employee count before those that do.
					(a, b) =>
						sortByBoolean(
							!a.localeData.who.minEmployeesInLocale,
							!b.localeData.who.minEmployeesInLocale
						)
				])
			);
			// Then include all the rest. (Looking at you, Toledo)
			matches = matches;
		}
	}
</script>

<main>
	<h1>Discover Pay Transparency Rights for Your Situation</h1>
	<form class="pb-4">
		<div class="grid grid-cols-1 gap-6">
			<label class="block" for="situation"
				>What's your situation?
				<select
					bind:value={situation}
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
					bind:value={location}
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
					bind:checked={employeeInLocation}
					class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
				/>
				Does the employer already have any employees in your location?
			</label>

			<label class="block" for="companyLocation"
				>Where is the employer located?
				<aside class="italic text-xs">If you don't know, choose "Somewhere else".</aside>
				<select
					bind:value={companyLocation}
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
					bind:value={totalEmployees}
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
					bind:value={roleLocation}
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
	</form>

	<h2 class="pb-0">Your Disclosure Rights</h2>
	{#if matches}
		<aside class="italic text-xs pb-6">
			This analysis is based on a summary of laws by a non-attorney. Review laws in detail before
			taking action, or retain an attorney in your area.
		</aside>

		<div class="flex flex-row flex-wrap justify-center">
			{#each matches as match}
				<div class="p-6 grow justify-left text-left">
					<p>
						<a href={`/locations/${match.localeId}`}>
							<img
								alt={getFormattedLocale(match.localeData)}
								src={`svgs/${match.localeData.stateCode}.svg`}
								class="float-right"
							/>

							<strong>{getFormattedLocale(match.localeData)}</strong></a
						>
						requires the disclosure of
					</p>
					<ul class="pb-2 indent">
						{#if match.localeData.what.salary}
							<li>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="w-6 h-6 fill-green-900"
								>
									<path
										d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z"
									/>
									<path
										fill-rule="evenodd"
										d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
										clip-rule="evenodd"
									/>
								</svg>
								the <strong>pay range</strong>
							</li>
						{/if}
						{#if match.localeData.what.benefits}
							<li>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="w-6 h-6 fill-orange-700"
								>
									<path
										fill-rule="evenodd"
										d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
										clip-rule="evenodd"
									/>
								</svg>
								the <strong>benefits</strong>
							</li>
						{/if}
					</ul>
					{#if match.minEmployeesInLocale}if the company has at least {match.minEmployeesInLocale} employee{#if match.minEmployeesInLocale > 1}s{/if}
						located there.{/if}
					{#if match.localeData.who.officeInLocale}if the company has a presence there.{/if}
					{#if match.localeData.when.requestRequired} You must explicitly request this data.{/if}
				</div>
			{/each}
		</div>
	{:else}
		Enter more information about your situation above to show applicable laws.
	{/if}
</main>
