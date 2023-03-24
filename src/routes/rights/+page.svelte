<script lang="ts">
	import { data, getFormattedLocale } from '$lib/data';
	import { createQueryStore } from '$lib/URLParamStore';
	import {
		Params,
		type Match,
		US_REMOTE_LOCALE,
		OTHER_LOCALE,
		isOrInsideLocale,
		Situation
	} from '$lib/checking';
	import CheckSituation from '$lib/CheckSituation.svelte';
	import GreenCheckIcon from '$lib/GreenCheckIcon.svelte';
	import RedPlusIcon from '$lib/RedPlusIcon.svelte';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import StateIcon from '$lib/StateIcon.svelte';

	let pageParams = browser ? createQueryStore(Params) : writable(Params.parse({}));

	let matches: Match[];

	$: validParams = Boolean(
		$pageParams &&
			$pageParams.userLocation &&
			$pageParams.roleLocation.length &&
			$pageParams.companyLocation &&
			$pageParams.totalEmployees
	);

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

		matches = [];
		// TODO: handle "employed" disclosure point differently.
		// TODO: if user is in a city, check their state laws
		// as a user location too.
		if (validParams) {
			const companyLocale = data[$pageParams.companyLocation];
			const userLocale = data[$pageParams.userLocation];

			for (const l of Object.keys(data)) {
				const thisLocale = data[l];
				const disclosureSituations = thisLocale.when.map((s) => s.situation).sort();

				// Is this actually a hireable locale?
				const isEligibleHireLocale =
					$pageParams.roleLocation.filter(
						(eachLocale) =>
							eachLocale === US_REMOTE_LOCALE ||
							(eachLocale !== OTHER_LOCALE && isOrInsideLocale(thisLocale, data[eachLocale]))
					).length > 0;
				if (!isEligibleHireLocale) continue;

				// Would this locality's "when" rules apply to the user's situation?
				const situationMatch =
					($pageParams.situation === Situation.Employed &&
						disclosureSituations.includes(Situation.Employed)) ||
					($pageParams.situation !== Situation.Employed &&
						$pageParams.situation >= disclosureSituations[0]);

				// Would this locality's "who" rules apply to the user's situation?
				const employeeCountMatch =
					!thisLocale.who.minEmployees || thisLocale.who.minEmployees <= $pageParams.totalEmployees;
				const officeInLocaleMatch = 1;

				// TODO: don't include the user's own locale if locale-employee minimum not met.
				if (situationMatch && employeeCountMatch) {
					// Is this locality either the user's location or the company's?
					// (A geographic match makes the fit easier to evaluate).
					const geographicMatch =
						isOrInsideLocale(companyLocale, thisLocale) ||
						(isOrInsideLocale(userLocale, thisLocale) &&
							(thisLocale.who.minEmployeesInLocale || 0 <= 1) &&
							$pageParams.employeeInLocation);
					const minEmployees = geographicMatch ? 0 : thisLocale.who.minEmployeesInLocale || 0;

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
			const sortByCriteria = <T>(criteria: ((a: T, b: T) => 0 | 1 | -1)[]) => {
				return function (a: T, b: T) {
					for (let criterion of criteria) {
						let result = criterion(a, b);
						if (result !== 0) {
							return result;
						}
					}
					return 0;
				};
			};

			// Sort matches with the best up front.
			matches.sort(
				sortByCriteria([
					// Sort those that are equal to either the user or employer location.
					(a: Match, b: Match) =>
						sortByBoolean(
							isOrInsideLocale(a.localeData, companyLocale) ||
								isOrInsideLocale(a.localeData, userLocale),
							isOrInsideLocale(b.localeData, companyLocale) ||
								isOrInsideLocale(b.localeData, userLocale)
						),
					// Then, sort those that disclose more before those that disclose less.
					(a: Match, b: Match) => sortByBoolean(a.what.benefits || false, b.what.benefits || false),
					// Then, sort those that do not require a minimum local employee count before those that do.
					(a: Match, b: Match) =>
						sortByBoolean(
							!a.localeData.who.minEmployeesInLocale,
							!b.localeData.who.minEmployeesInLocale
						)
				])
			);
			matches = matches;
		}
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
		It looks like you didn't share enough information about your situation. <a href="/check"
			>Find Your Rights</a
		>.
	</p>
{/if}
{#if matches.length}
	<p>
		PayTransparency.work believes the the following laws may provide transparency rights in your
		situation.
	</p>
{:else}
	<p>
		Unfortunately, PayTransparency.work could not find any laws that provide transparency rights in
		your situation.
	</p>
{/if}
<div class="grid grid-cols-2">
	{#each matches as match}
		<div class="p-6 justify-left text-left">
			<p>
				<a href={`/locations/${match.localeId}`}>
					<span class="float-right"><StateIcon locale={match.localeData} /></span>
					<strong>{getFormattedLocale(match.localeData)}</strong></a
				>
				requires the disclosure of
			</p>
			<ul class="pb-2 indent">
				{#if match.localeData.what.salary}
					<li>
						<GreenCheckIcon />
						the <strong>pay range</strong>
					</li>
				{/if}
				{#if match.localeData.what.benefits}
					<li>
						<RedPlusIcon />
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
