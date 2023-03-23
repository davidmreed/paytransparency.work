<script lang="ts">
	import { data, getFormattedLocale } from '$lib/data';
	import { createQueryStore } from '$lib/URLParamStore';
	import {
		Params,
		Situation,
		type Match,
		US_REMOTE_LOCALE,
		OTHER_LOCALE,
		shimDisclosurePoints,
		isOrInsideLocale
	} from '$lib/checking';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	let pageParams = browser ? createQueryStore(Params) : writable(Params.parse({}));

	let matches: Match[];

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

		if (
			$pageParams &&
			$pageParams.userLocation &&
			$pageParams.roleLocation.length &&
			$pageParams.companyLocation &&
			$pageParams.totalEmployees
		) {
			const companyLocale = data[$pageParams.companyLocation];
			const userLocale = data[$pageParams.userLocation];

			for (const l of Object.keys(data)) {
				const thisLocale = data[l];
				const disclosureSituations = shimDisclosurePoints(thisLocale);

				// Would this locality's disclosure rule apply to the user's situation?
				const situationMatch = $pageParams.situation >= disclosureSituations[0];
				// Is this locality either the user's location or the company's?
				// (A geographic match makes the fit easier to evaluate).
				const geographicMatch =
					isOrInsideLocale(companyLocale, thisLocale) ||
					(isOrInsideLocale(userLocale, thisLocale) &&
						(thisLocale.who.minEmployeesInLocale || 0 <= 1) &&
						$pageParams.employeeInLocation);
				// Do we have a match on the total number of employees?
				const employeeCountMatch =
					!thisLocale.who.minEmployees || thisLocale.who.minEmployees <= $pageParams.totalEmployees;
				// Is this actually a hireable locale?
				const isEligibleHireLocale =
					$pageParams.roleLocation.filter(
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

<h2 class="pb-0">Your Disclosure Rights</h2>
<aside class="italic text-xs pb-6">
	This analysis is based on a summary of laws by a non-attorney. Review laws in detail before taking
	action, or retain an attorney in your area.
</aside>

<div class="grid grid-cols-2">
	{#each matches as match}
		<div class="p-6 justify-left text-left">
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
