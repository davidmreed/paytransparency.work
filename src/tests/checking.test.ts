import { findMatchingLaws, isValidParams, Params } from '$lib/checking';
import {
	Situation,
	Locale,
	Strength,
	OTHER_LOCALE,
	US_REMOTE_LOCALE,
	type AbstractLocale,
	UnknownLocale,
	AllUSLocale
} from '$lib/data';
import { describe, expect, it } from 'vitest';

// NOTE: this set of locales does not match the set used in production!
// This is a test data set that draws on, but mutates, real data.
const locales: Record<string, Locale> = [
	new Locale({
		state: 'Colorado',
		stateCode: 'CO',
		strength: Strength.Strong,
		who: {
			minEmployeesInLocale: 1,
			canHireInLocale: true
		},
		when: [{ situation: Situation.Interested }],
		what: {
			salary: true,
			benefits: true
		}
	}),
	new Locale({
		// Note: the California disclosure requirements upon request
		// do not require that the 15-employee minimum is met.
		state: 'California',
		stateCode: 'CA',
		strength: Strength.Strong,
		when: [{ situation: Situation.Interested }, { situation: Situation.Employed }],
		who: {
			minEmployees: 15,
			minEmployeesInLocale: 1,
			canHireInLocale: true
		},
		what: {
			salary: true
		}
	}),
	new Locale({
		// Note: Washington also requires that "Upon request of an employee offered an internal transfer to a new position or promotion, the employer must provide the wage scale or salary range for the employee's new position"
		// Guidance from Washington: https://www.lni.wa.gov/workers-rights/_docs/ese1.pdf
		state: 'Washington',
		stateCode: 'WA',
		strength: Strength.Strong,
		who: {
			minEmployees: 15,
			minEmployeesInLocale: 1,
			canHireInLocale: true
		},
		when: [{ situation: Situation.Interested }],
		what: {
			salary: true,
			benefits: true
		}
	}),
	new Locale({
		state: 'Nevada',
		stateCode: 'NV',
		strength: Strength.Weak,
		who: {
			officeInLocale: true
		},
		when: [{ situation: Situation.Interview }],
		what: {
			salary: true
		}
	}),
	new Locale({
		state: 'Nevada',
		stateCode: 'NV',
		city: 'Goodsprings',
		strength: Strength.Strong,
		who: {
			minEmployeesInLocale: 5
		},
		when: [{ situation: Situation.Interview }],
		what: {
			salary: true,
			benefits: true
		}
	}),
	new Locale({
		state: 'Ohio',
		stateCode: 'OH',
		city: 'Toledo',
		strength: Strength.Weak,
		what: {
			salary: true
		},
		when: [{ situation: Situation.Offer, requestRequired: true }],
		who: {
			minEmployeesInLocale: 15,
			officeInLocale: true
		}
	}),
	new Locale({
		state: 'New York',
		stateCode: 'NY',
		strength: Strength.Strong,
		what: {
			salary: true
		},
		when: [{ situation: Situation.Interested }],
		who: {
			officeSupervisorInLocale: true
		}
	})
].reduce((map, locale) => {
	map[locale.id] = locale;
	return map;
}, {} as Record<string, Locale>);

const allLocales: Record<string, AbstractLocale> = {
	[OTHER_LOCALE]: new UnknownLocale(),
	[US_REMOTE_LOCALE]: new AllUSLocale(),
	...locales
};

describe('parsing parameters', () => {
	it('parses valid parameters', () => {
		const params = Params.parse({
			situation: Situation.Interested,
			userLocation: 'california',
			companyLocation: 'colorado',
			employeeInLocation: true,
			totalEmployees: 50,
			roleLocation: 'california,colorado'
		});

		expect(params.situation).toBe(Situation.Interested);
		expect(params.userLocation).toBe('california');
		expect(params.companyLocation).toBe('colorado');
		expect(params.employeeInLocation).toBe(true);
		expect(params.totalEmployees).toBe(50);
		expect(params.roleLocation).toStrictEqual(['california', 'colorado']);
	});

	it('allows no role location for Situation.Employed', () => {
		const params = Params.parse({
			situation: Situation.Employed,
			userLocation: 'california',
			companyLocation: 'colorado',
			employeeInLocation: true,
			totalEmployees: 50
		});

		expect(params.situation).toBe(Situation.Employed);
	});

	it('rejects invalid locales', () => {
		try {
			Params.parse({ userLocation: 'foo' });
			expect(false).toBe(true);
		} catch (e) {
			// Do nothing
		}
	});
});

describe('validating parameters', () => {
	it('confirms valid parameters', () => {
		expect(
			isValidParams(
				Params.parse({
					situation: 1,
					userLocation: 'california',
					companyLocation: 'colorado',
					officeSupervisorLocation: 'other',
					employeeInLocation: true,
					totalEmployees: 50,
					roleLocation: 'california,colorado'
				})
			)
		).toBe(true);
	});

	it('notes invalid parameters', () => {
		expect(isValidParams(Params.parse({}))).toBe(false);
	});

	it('requires at least one roleLocation', () => {
		expect(
			isValidParams(
				Params.parse({
					situation: 1,
					userLocation: 'california',
					companyLocation: 'colorado',
					officeSupervisorLocation: 'other',
					employeeInLocation: true,
					totalEmployees: 50
				})
			)
		).toBe(false);
	});
});

describe('matches simple laws', () => {
	const matches = findMatchingLaws(
		{
			situation: Situation.Interested,
			userLocation: 'california',
			companyLocation: 'colorado',
			officeSupervisorLocation: 'other',
			employeeInLocation: true,
			totalEmployees: 50,
			roleLocation: ['california', 'colorado', 'washington', 'nevada']
		},
		locales,
		allLocales
	);

	it('includes matching user location', () => {
		expect(matches).toContainEqual({
			locale: locales['california'],
			earliestDisclosurePoint: Situation.Interested,
			minEmployeesInLocale: 0,
			what: { salary: true },
			isGeoMatch: true
		});
	});
	it('includes matching company location', () => {
		expect(matches).toContainEqual({
			locale: locales['colorado'],
			earliestDisclosurePoint: Situation.Interested,
			minEmployeesInLocale: 0,
			what: { salary: true, benefits: true },
			isGeoMatch: true
		});
	});
	it('includes matching third location', () => {
		expect(matches).toContainEqual({
			locale: locales['washington'],
			earliestDisclosurePoint: Situation.Interested,
			minEmployeesInLocale: 1,
			what: { salary: true, benefits: true },
			isGeoMatch: false
		});
	});
	it('does not include non-matching location', () => {
		expect(matches.filter((m) => m.locale.id === 'nevada').length).toBe(0);
	});
});

describe('matches with placeholder role location', () => {
	const matches = findMatchingLaws(
		{
			situation: Situation.Interested,
			userLocation: 'california',
			companyLocation: 'colorado',
			officeSupervisorLocation: 'other',
			employeeInLocation: true,
			totalEmployees: 50,
			roleLocation: ['us', 'other']
		},
		locales,
		allLocales
	);

	it('includes matching user location', () => {
		expect(matches).toContainEqual({
			locale: locales['california'],
			earliestDisclosurePoint: Situation.Interested,
			minEmployeesInLocale: 0,
			what: { salary: true },
			isGeoMatch: true
		});
	});
	it('includes matching company location', () => {
		expect(matches).toContainEqual({
			locale: locales['colorado'],
			earliestDisclosurePoint: Situation.Interested,
			minEmployeesInLocale: 0,
			what: { salary: true, benefits: true },
			isGeoMatch: true
		});
	});
	it('includes matching third location with employee threshold', () => {
		expect(matches).toContainEqual({
			locale: locales['washington'],
			earliestDisclosurePoint: Situation.Interested,
			minEmployeesInLocale: 1,
			what: { salary: true, benefits: true },
			isGeoMatch: false
		});
	});
	it('does not include non-matching location', () => {
		expect(matches.filter((m) => m.locale.id === 'nevada').length).toBe(0);
	});
	it('does not include abstract location matches', () => {
		expect(matches.filter((m) => m.locale.id === 'us').length).toBe(0);
		expect(matches.filter((m) => m.locale.id === 'other').length).toBe(0);
	});
});

describe('matches with placeholder user location', () => {
	const matches = findMatchingLaws(
		{
			situation: Situation.Interested,
			userLocation: 'other',
			companyLocation: 'colorado',
			officeSupervisorLocation: 'other',
			employeeInLocation: false,
			totalEmployees: 50,
			roleLocation: ['us', 'other']
		},
		locales,
		allLocales
	);

	it('includes matching company location', () => {
		expect(matches).toContainEqual({
			locale: locales['colorado'],
			earliestDisclosurePoint: Situation.Interested,
			minEmployeesInLocale: 0,
			what: { salary: true, benefits: true },
			isGeoMatch: true
		});
	});
});

describe('matches with sub-locations', () => {
	it('includes both city and state company locales', () => {
		const matches = findMatchingLaws(
			{
				situation: Situation.Interview,
				userLocation: 'other',
				companyLocation: 'nevada-goodsprings',
				officeSupervisorLocation: 'other',
				employeeInLocation: true,
				totalEmployees: 50,
				roleLocation: ['nevada']
			},
			locales,
			allLocales
		);

		expect(matches).toContainEqual({
			locale: locales['nevada-goodsprings'],
			earliestDisclosurePoint: Situation.Interview,
			minEmployeesInLocale: 5,
			what: { salary: true, benefits: true },
			isGeoMatch: true
		});
		expect(matches).toContainEqual({
			locale: locales['nevada'],
			earliestDisclosurePoint: Situation.Interview,
			minEmployeesInLocale: 0,
			what: { salary: true },
			isGeoMatch: true
		});
	});

	it('includes both city and state user locales', () => {
		const matches = findMatchingLaws(
			{
				situation: Situation.Interview,
				userLocation: 'nevada-goodsprings',
				companyLocation: 'california',
				officeSupervisorLocation: 'other',
				employeeInLocation: true,
				totalEmployees: 50,
				roleLocation: ['us']
			},
			locales,
			allLocales
		);

		expect(matches).toContainEqual({
			locale: locales['nevada-goodsprings'],
			earliestDisclosurePoint: Situation.Interview,
			minEmployeesInLocale: 5,
			what: { salary: true, benefits: true },
			isGeoMatch: true
		});
		expect(matches).toContainEqual({
			locale: locales['nevada'],
			earliestDisclosurePoint: Situation.Interview,
			minEmployeesInLocale: 0,
			what: { salary: true },
			isGeoMatch: true
		});
	});
});

describe('handles different situation thresholds', () => {
	it('handles Employed situations with employee out of state', () => {
		const matches = findMatchingLaws(
			{
				situation: Situation.Employed,
				userLocation: 'colorado',
				companyLocation: 'california',
				officeSupervisorLocation: 'other',
				employeeInLocation: false,
				totalEmployees: 50,
				roleLocation: ['us']
			},
			locales,
			allLocales
		);

		expect(matches.length).toBe(1);
		expect(matches).toContainEqual({
			locale: locales['california'],
			earliestDisclosurePoint: Situation.Interested,
			minEmployeesInLocale: 0,
			what: { salary: true },
			isGeoMatch: true
		});
	});

	it('handles Employed situation with user in state', () => {
		const matches = findMatchingLaws(
			{
				situation: Situation.Employed,
				userLocation: 'california',
				companyLocation: 'colorado',
				officeSupervisorLocation: 'other',
				employeeInLocation: false,
				totalEmployees: 50,
				roleLocation: ['us']
			},
			locales,
			allLocales
		);

		expect(matches.length).toBe(1);
		expect(matches).toContainEqual({
			locale: locales['california'],
			earliestDisclosurePoint: Situation.Interested,
			minEmployeesInLocale: 0,
			what: { salary: true },
			isGeoMatch: true
		});
	});

	it('handles Offer situations', () => {
		const matches = findMatchingLaws(
			{
				situation: Situation.Offer,
				userLocation: 'other',
				companyLocation: 'ohio-toledo',
				officeSupervisorLocation: 'other',
				employeeInLocation: false,
				totalEmployees: 50,
				roleLocation: ['us']
			},
			locales,
			allLocales
		);

		expect(matches).toContainEqual({
			locale: locales['ohio-toledo'],
			earliestDisclosurePoint: Situation.Offer,
			minEmployeesInLocale: 15,
			what: { salary: true },
			isGeoMatch: true
		});
	});
});

it("handles New York's supervisor-location rubric", () => {
	const matches = findMatchingLaws(
		{
			situation: Situation.Interested,
			userLocation: 'other',
			companyLocation: 'california',
			officeSupervisorLocation: 'new-york',
			employeeInLocation: false,
			totalEmployees: 50,
			roleLocation: ['california']
		},
		locales,
		allLocales
	);

	expect(matches.length).toEqual(2);
	expect(matches).toContainEqual({
		locale: locales['new-york'],
		earliestDisclosurePoint: Situation.Interested,
		minEmployeesInLocale: 0,
		what: { salary: true },
		isGeoMatch: true
	});
});
