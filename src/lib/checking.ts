import { z } from 'zod';
import {
	locales,
	OTHER_LOCALE,
	US_REMOTE_LOCALE,
	type Locale,
	type WhatDisclosure,
	Situation,
	allLocales,
	type AbstractLocale
} from '$lib/data';
import { sortByBoolean, sortByCriteria } from './sorting';

export const Params = z.object({
	situation: z
		.number()
		.min(Situation.Interested)
		.max(Situation.Employed)
		.default(Situation.Interested),
	userLocation: z
		.string()
		.default('')
		.refine((s) => Object.keys(locales).includes(s) || s === '' || s === OTHER_LOCALE),
	companyLocation: z
		.string()
		.default('')
		.refine((s) => Object.keys(locales).includes(s) || s === '' || s === OTHER_LOCALE),
	officeSupervisorLocation: z
		.string()
		.default('')
		.refine((s) => Object.keys(locales).includes(s) || s === '' || s === OTHER_LOCALE),
	employeeInLocation: z.boolean().default(false),
	// This circumlocution avoids an issue with how Zod handles
	// some input values, resulting in a parse failure if the user deletes the content of the field.
	totalEmployees: z.coerce
		.string()
		.default('')
		.transform((s) => Number(s) || 0),
	roleLocation: z
		.string()
		.default('')
		.transform((s) => s.split(',').filter((m) => m !== ''))
		.refine((s) =>
			s.every(
				(l) => Object.keys(locales).includes(l) || l === OTHER_LOCALE || l === US_REMOTE_LOCALE
			)
		)
});

export type MatchParameters = z.TypeOf<typeof Params>;

export interface Match {
	locale: Locale;
	earliestDisclosurePoint: Situation;
	minEmployeesInLocale?: number;
	what: WhatDisclosure;
	isGeoMatch: boolean;
}

export function isValidParams(params: MatchParameters): boolean {
	return Boolean(
		params &&
		params.situation !== undefined &&
		params.userLocation &&
		(params.roleLocation.length > 0 || params.situation === Situation.Employed) &&
		params.companyLocation &&
		params.officeSupervisorLocation &&
		params.totalEmployees
	);
}

export function findMatchingLaws(
	params: MatchParameters,
	useLocales?: Record<string, Locale>,
	useAllLocales?: Record<string, AbstractLocale>
): Match[] {
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

	const matches: Match[] = [];

	if (isValidParams(params)) {
		// Allow tests or other functions to override which locales we can use.
		const availableLocales = useLocales ?? locales;
		const availableAllLocales = useAllLocales ?? allLocales;

		// Company locales are the actual location of the company plus any locales that contain that locale.
		const companyLocales =
			params.companyLocation !== OTHER_LOCALE
				? Object.values(availableLocales).filter((l) =>
					l.isOrContains(availableLocales[params.companyLocation])
				)
				: [];
		// Same rubric for users.
		const userLocales =
			params.userLocation !== OTHER_LOCALE
				? Object.values(availableLocales).filter((l) =>
					l.isOrContains(availableLocales[params.userLocation])
				)
				: [];
		// And same rubric for supervisor/office locales.
		const supervisorOfficeLocales =
			params.officeSupervisorLocation !== OTHER_LOCALE
				? Object.values(availableLocales).filter((l) =>
					l.who.officeSupervisorInLocale && l.isOrContains(availableLocales[params.officeSupervisorLocation])
				)
				: [];

		for (const thisLocale of Object.values(availableLocales)) {
			const disclosureSituations = thisLocale.when.map((s) => s.situation).sort();

			// Is this actually a hireable locale?
			// TODO: There are probably situations where a locale is not hireable but
			// local law might prevail on a company located there.
			const isEligibleHireLocale =
				params.roleLocation.filter((eachLocale) =>
					availableAllLocales[eachLocale].isOrContains(thisLocale)
				).length > 0;
			if (!isEligibleHireLocale && params.situation !== Situation.Employed) continue;

			// Would this locale's "when" rules apply to the user's situation?
			const situationMatch =
				(params.situation === Situation.Employed &&
					disclosureSituations.includes(Situation.Employed)) ||
				(params.situation !== Situation.Employed && params.situation >= disclosureSituations[0]);

			// Would this locale's "who" rules apply to the user's situation?
			const totalEmployeeCountMatch =
				!thisLocale.who.minEmployees || thisLocale.who.minEmployees <= params.totalEmployees;

			if (situationMatch && totalEmployeeCountMatch) {
				// Is this locality the same as or encloses either the user's location or the company's?
				// (A geographic match makes the fit easier to evaluate).
				const geographicMatch = Boolean(
					companyLocales.map((c) => thisLocale.isOrContains(c)).some((f) => f) ||
					supervisorOfficeLocales.map((u) => thisLocale.isOrContains(u)).some((f) => f) ||
					(userLocales.map((u) => thisLocale.isOrContains(u)).some((f) => f) &&
						(thisLocale.who.minEmployeesInLocale || 0 <= 1) &&
						(params.employeeInLocation || params.situation === Situation.Employed))
				);

				// Determine if we match the _local_ employee count requirement (if present).
				// We don't ask users to enter this data because they likely do not have it,
				// and cannot enter it for a multitude of jurisdictions.
				let requiredLocalEmployees = thisLocale.who.minEmployeesInLocale || 0;
				// If the required employee count is 1 and we already know the company
				// has a presence in this locale via user data entry,
				// omit this requirement.
				if (requiredLocalEmployees === 1 && geographicMatch) {
					requiredLocalEmployees = 0;
				}

				matches.push({
					locale: thisLocale,
					what: thisLocale.what,
					minEmployeesInLocale: requiredLocalEmployees,
					earliestDisclosurePoint: disclosureSituations[0],
					isGeoMatch: geographicMatch
				});
			}
		}

		// Sort matches with the best up front.
		matches.sort(
			sortByCriteria([
				// Sort those that are equal to either the user or employer location.
				(a: Match, b: Match) => sortByBoolean(a.isGeoMatch, b.isGeoMatch),
				// Then, sort those that disclose more before those that disclose less.
				(a: Match, b: Match) => sortByBoolean(a.what.benefits || false, b.what.benefits || false),
				// Then, sort those that do not require a minimum local employee count before those that do.
				(a: Match, b: Match) =>
					sortByBoolean(!a.locale.who.minEmployeesInLocale, !b.locale.who.minEmployeesInLocale)
			])
		);
	}
	return matches;
}
