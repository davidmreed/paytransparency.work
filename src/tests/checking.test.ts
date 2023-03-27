import { findMatchingLaws, isValidParams, Params } from '$lib/checking';
import { Situation, Locale, Strength, OTHER_LOCALE, US_REMOTE_LOCALE, type AbstractLocale, UnknownLocale, AllUSLocale } from '$lib/data';
import { describe, expect, it } from 'vitest';


// NOTE: this set of locales does not match the set used in production!
// This is a test data set that draws on, but mutates, real data.
const locales: Record<string, Locale> = [
    new Locale({
        state: 'Colorado',
        stateCode: 'CO',
        strength: Strength.Strong,
        referenceSource: 'Colorado Department of Labor and Enforcement',
        referenceUrl: 'https://cdle.colorado.gov/equalpaytransparency',
        reportViolationUrl: 'https://cdle.colorado.gov/equalpaytransparency',
        reportViolationProcess: 'by submitting a PDF form via email',
        who: {
            minEmployeesInLocale: 1,
            canHireInLocale: true
        },
        when: [
            { situation: Situation.Interested }
        ],
        what: {
            salary: true,
            benefits: true
        },
        penalty: 'between $500 and $10,000 per violation',
        legalUrl: 'https://leg.colorado.gov/sites/default/files/2019a_085_signed.pdf'
    }),
    new Locale({
        // Note: the California disclosure requirements upon request
        // do not require that the 15-employee minimum is met.
        state: 'California',
        stateCode: 'CA',
        strength: Strength.Strong,
        when: [
            { situation: Situation.Interested },
            { situation: Situation.Employed }
        ],
        who: {
            minEmployees: 15,
            minEmployeesInLocale: 1,
            canHireInLocale: true,
        },
        what: {
            salary: true,
        },
        referenceUrl: 'https://www.dir.ca.gov/dlse/california_equal_pay_act.htm',
        referenceSource: 'California Department of Industrial Relations',
        legalUrl: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202120220SB1162',
        penalty: 'between $100 and $10,000 per violation',
        reportViolationProcess: 'by filing a complaint in writing with the California Labor Commissioner',
        reportViolationUrl: 'https://www.dir.ca.gov/dlse/howtofileretaliationcomplaint.htm'
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
            canHireInLocale: true,
        },
        when: [
            { situation: Situation.Interested }
        ],
        what: {
            salary: true,
            benefits: true
        },
        referenceUrl: 'https://lni.wa.gov/workers-rights/wages/equal-pay-opportunities-act/#job-postings',
        referenceSource: 'Washington Department of Labor & Industries',
        legalUrl: 'https://app.leg.wa.gov/RCW/default.aspx?cite=49.58.110',
        reportViolationUrl: 'https://lni.wa.gov/workers-rights/workplace-complaints/index',
        reportViolationProcess: 'by filing a complaint online with the Washington Department of Labor & Industries'
    }),
    new Locale({
        state: 'Nevada',
        stateCode: 'NV',
        strength: Strength.Weak,
        who: {
            // Nevada's definition is unclear
            officeInLocale: true,
        },
        when: [
            { situation: Situation.Interview }
        ],
        what: {
            salary: true,
        },
        legalUrl: 'https://www.leg.state.nv.us/App/NELIS/REL/81st2021/Bill/7896/Text',
        penalty: 'up to $5,000 per violation',
    }),
    new Locale({
        state: 'Nevada',
        stateCode: 'NV',
        city: 'Goodsprings',
        strength: Strength.Strong,
        who: {
            minEmployeesInLocale: 5,
        },
        when: [
            { situation: Situation.Interview }
        ],
        what: {
            salary: true,
            benefits: true
        },
    }),
    new Locale({
        state: 'Ohio',
        stateCode: 'OH',
        city: 'Toledo',
        strength: Strength.Weak,
        what: {
            salary: true
        },
        when: [
            { situation: Situation.Offer, requestRequired: true }
        ],
        who: {
            minEmployeesInLocale: 15,
            officeInLocale: true,
        },
        legalUrl: 'https://codelibrary.amlegal.com/codes/toledo/latest/toledo_oh/0-0-0-159338',
        reportViolationProcess: 'a private cause of action; no enforcement is done by the city'
    })
].reduce((map, locale) => { map[locale.id] = locale; return map; }, {} as Record<string, Locale>);

const allLocales: Record<string, AbstractLocale> = {
    [OTHER_LOCALE]: new UnknownLocale(),
    [US_REMOTE_LOCALE]: new AllUSLocale(),
    ...locales
};


describe('parsing parameters', () => {
    it('parses valid parameters', () => {
        const params = Params.parse({
            situation: 1,
            userLocation: 'california',
            companyLocation: 'colorado',
            employeeInLocation: true,
            totalEmployees: 50,
            roleLocation: "california,colorado"
        });

        expect(params.situation).toBe(Situation.Application);
        expect(params.userLocation).toBe('california');
        expect(params.companyLocation).toBe('colorado');
        expect(params.employeeInLocation).toBe(true);
        expect(params.totalEmployees).toBe(50);
        expect(params.roleLocation).toStrictEqual(['california', 'colorado']);
    });

    it('rejects invalid locales', () => {
        try {
            Params.parse({ userLocation: 'foo' });
            expect(false).toBe(true);
        } catch (e) {
            // Do nothing
        }
    })
});

describe('validating parameters', () => {
    it('confirms valid parameters', () => {
        expect(isValidParams(Params.parse({
            situation: 1,
            userLocation: 'california',
            companyLocation: 'colorado',
            employeeInLocation: true,
            totalEmployees: 50,
            roleLocation: "california,colorado"
        }))).toBe(true);
    });

    it('notes invalid parameters', () => {
        expect(isValidParams(Params.parse({}))).toBe(false);
    });
});

describe('matches simple laws', () => {
    const matches = findMatchingLaws({
        situation: Situation.Interested,
        userLocation: 'california',
        companyLocation: 'colorado',
        employeeInLocation: true,
        totalEmployees: 50,
        roleLocation: ["california", "colorado", "washington", "nevada"]
    });

    it('includes matching user location', () => {
        expect(matches).toContainEqual({
            locale: locales['california'],
            earliestDisclosurePoint: Situation.Interested,
            minEmployeesInLocale: 0,
            what: { salary: true }
        });
    });
    it('includes matching company location', () => {
        expect(matches).toContainEqual({
            locale: locales['colorado'],
            earliestDisclosurePoint: Situation.Interested,
            minEmployeesInLocale: 0,
            what: { salary: true, benefits: true }
        });
    });
    it('includes matching third location', () => {
        expect(matches).toContainEqual({
            locale: locales['washington'],
            earliestDisclosurePoint: Situation.Interested,
            minEmployeesInLocale: 1,
            what: { salary: true, benefits: true }
        });
    });
    it('does not include non-matching location', () => {
        expect(matches.filter((m) => m.locale.id === 'nevada').length).toBe(0);
    });
});

describe('matches with placeholder locations', () => {
    const matches = findMatchingLaws({
        situation: Situation.Interested,
        userLocation: 'california',
        companyLocation: 'colorado',
        employeeInLocation: true,
        totalEmployees: 50,
        roleLocation: ["us", "other"]
    }, locales, allLocales);

    it('includes matching user location', () => {
        expect(matches).toContainEqual({
            locale: locales['california'],
            earliestDisclosurePoint: Situation.Interested,
            minEmployeesInLocale: 0,
            what: { salary: true }
        });
    });
    it('includes matching company location', () => {
        expect(matches).toContainEqual({
            locale: locales['colorado'],
            earliestDisclosurePoint: Situation.Interested,
            minEmployeesInLocale: 0,
            what: { salary: true, benefits: true }
        });
    });
    it('includes matching third location with employee threshold', () => {
        expect(matches).toContainEqual({
            locale: locales['washington'],
            earliestDisclosurePoint: Situation.Interested,
            minEmployeesInLocale: 1,
            what: { salary: true, benefits: true }
        });
    });
    it('includes does not include non-matching location', () => {
        expect(matches.filter((m) => m.locale.id === 'nevada').length).toBe(0);
    });
    it('does not include abstract location matches', () => {
        expect(matches.filter((m) => m.locale.id === 'us').length).toBe(0);
        expect(matches.filter((m) => m.locale.id === 'other').length).toBe(0);
    });

});

describe('matches with sub-locations', () => {
    const matches = findMatchingLaws({
        situation: Situation.Interview,
        userLocation: 'other',
        companyLocation: 'nevada-goodsprings',
        employeeInLocation: true,
        totalEmployees: 50,
        roleLocation: ["nevada"]
    }, locales, allLocales);

    it('includes both city and state locales', () => {
        expect(matches).toContainEqual({
            locale: locales['nevada-goodsprings'],
            earliestDisclosurePoint: Situation.Interview,
            minEmployeesInLocale: 5,
            what: { salary: true, benefits: true }
        });
        expect(matches).toContainEqual({
            locale: locales['nevada'],
            earliestDisclosurePoint: Situation.Interview,
            minEmployeesInLocale: 0,
            what: { salary: true }
        });
    });

});


describe('handles different situation thresholds', () => {

});

