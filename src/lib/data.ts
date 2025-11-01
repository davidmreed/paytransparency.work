export enum Situation {
	Interested,
	Application,
	Interview,
	Offer,
	Hire,
	Employed
}

export interface AbstractLocale {
	name: string;
	id: string;

	isOrContains(other: AbstractLocale): boolean;
}

export const US_REMOTE_LOCALE = 'us';
export const CA_REMOTE_LOCALE = 'canada';
export const OTHER_LOCALE = 'other';

export class UnknownLocale implements AbstractLocale {
	get name() {
		return 'Somewhere else';
	}

	get id() {
		return OTHER_LOCALE;
	}

	isOrContains(): boolean {
		return false;
	}
}

export class AllUSLocale implements AbstractLocale {
	get name() {
		return 'All US (Remote)';
	}

	get id() {
		return US_REMOTE_LOCALE;
	}

	isOrContains(other: AbstractLocale | Locale): boolean {
		return 'country' in other && other.country === 'United States';
	}
}

export class AllCanadaLocale implements AbstractLocale {
	get name() {
		return 'All Canada (Remote)';
	}

	get id() {
		return CA_REMOTE_LOCALE;
	}

	isOrContains(other: AbstractLocale | Locale): boolean {
		return 'country' in other && other.country === 'Canada';
	}
}

export class Locale implements AbstractLocale {
	country!: string;
	state!: string;
	stateCode!: string;
	city?: string;
	strength!: Strength;
	referenceSource?: string;
	referenceUrl?: string;
	legalUrl?: string;
	reportViolationUrl?: string;
	reportViolationProcess?: string;
	who!: WhoDisclosure;
	when!: { situation: Situation; requestRequired?: boolean }[];
	what!: WhatDisclosure;
	penalty?: string;

	constructor(params: {
		country: string;
		state: string;
		stateCode: string;
		city?: string;
		strength: Strength;
		referenceSource?: string;
		referenceUrl?: string;
		legalUrl?: string;
		reportViolationUrl?: string;
		reportViolationProcess?: string;
		who: WhoDisclosure;
		when: { situation: Situation; requestRequired?: boolean }[];
		what: WhatDisclosure;
		penalty?: string;
	}) {
		Object.assign(this, params);
	}

	get id() {
		const cityAndState = this.city
			? `${this.state.toLocaleLowerCase()}-${this.city.toLocaleLowerCase()}`
			: this.state.toLocaleLowerCase();

		return (
			this.country !== 'United States'
				? `${this.country.toLocaleLowerCase()}-${cityAndState}`
				: cityAndState
		).replaceAll(/\s+/g, '-');
	}

	get name() {
		return this.city ? `${this.city}, ${this.stateCode}` : this.state;
	}

	isOrContains(other: Locale) {
		return (
			this.country === other.country &&
			((this.state === other.state && this.city === other.city) ||
				(this.state === other.state && !this.city))
		);
	}
}

interface WhoDisclosure {
	officeInLocale?: boolean;
	canHireInLocale?: boolean;
	requiresPhysicalPresence?: boolean;
	officeSupervisorInLocale?: boolean;
	minEmployees?: number;
	minEmployeesInLocale?: number;
}

interface WhatDisclosure {
	salary?: boolean;
	benefits?: boolean;
}

export enum Strength {
	Weak = 'weak',
	Moderate = 'moderate',
	Strong = 'strong'
}

const locales: Record<string, Locale> = [
	new Locale({
		country: 'United States',
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
		when: [{ situation: Situation.Interested }],
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
		country: 'United States',
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
		},
		referenceUrl: 'https://www.dir.ca.gov/dlse/Pay-Trans-Instructions.pdf',
		referenceSource: 'California Division of Labor Standards Enforcement (PDF)',
		legalUrl:
			'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202120220SB1162',
		penalty: 'between $100 and $10,000 per violation',
		reportViolationProcess: 'by filling and emailing a PDF form',
		reportViolationUrl: 'https://www.dir.ca.gov/dlse/Pay-Transparency-Complaint.pdf'
	}),
	new Locale({
		// Note: Washington also requires that "Upon request of an employee offered an internal transfer to a new position or promotion, the employer must provide the wage scale or salary range for the employee's new position"
		// Guidance from Washington: https://www.lni.wa.gov/workers-rights/_docs/ese1.pdf
		country: 'United States',
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
		},
		referenceUrl:
			'https://lni.wa.gov/workers-rights/wages/equal-pay-opportunities-act/#job-postings',
		referenceSource: 'Washington Department of Labor & Industries',
		legalUrl: 'https://app.leg.wa.gov/RCW/default.aspx?cite=49.58.110',
		reportViolationUrl:
			'https://lni.wa.gov/workers-rights/wages/equal-pay-opportunities-act/#job-postings',
		reportViolationProcess:
			'by filing a complaint online with the Washington Department of Labor & Industries'
	}),
	new Locale({
		country: 'United States',
		state: 'Connecticut',
		stateCode: 'CT',
		strength: Strength.Moderate,
		who: {
			officeInLocale: true
		},
		what: {
			salary: true
		},
		when: [
			{ situation: Situation.Application },
			{ situation: Situation.Hire },
			{ situation: Situation.Offer },
			{ situation: Situation.Employed }
		],
		legalUrl: 'https://cga.ct.gov/2021/act/pa/pdf/2021PA-00030-R00HB-06380-PA.pdf',
		referenceUrl: 'https://portal.ct.gov/dolui/salary-range-disclosure-law-faqs',
		referenceSource: 'Connecticut Department of Labor',
		reportViolationProcess: 'by filing a complaint with the Labor Commissioner'
	}),
	new Locale({
		country: 'United States',
		state: 'New York',
		stateCode: 'NY',
		city: 'New York',
		strength: Strength.Strong,
		who: {
			minEmployees: 4,
			minEmployeesInLocale: 1,
			canHireInLocale: true
		},
		what: {
			salary: true
		},
		when: [{ situation: Situation.Interested }],
		referenceSource: 'New York Commission on Human Rights',
		referenceUrl: 'https://www.nyc.gov/site/cchr/media/pay-transparency.page',
		reportViolationUrl: 'https://www.nyc.gov/site/cchr/about/report-discrimination.page',
		penalty: 'up to $250,000 if employer does not come into compliance, or for second offenses'
	}),
	new Locale({
		country: 'United States',
		state: 'New York',
		stateCode: 'NY',
		city: 'Albany County',
		strength: Strength.Strong,
		who: {
			minEmployees: 4,
			canHireInLocale: true
		},
		what: {
			salary: true
		},
		when: [{ situation: Situation.Interested }],
		legalUrl: 'https://www.albanycounty.com/home/showpublisheddocument/27437/638103243588570000'
	}),
	new Locale({
		country: 'United States',
		state: 'Rhode Island',
		stateCode: 'RI',
		strength: Strength.Moderate,
		who: {
			// Rhode Island's definition is unclear.
			officeInLocale: true
		},
		what: {
			salary: true
		},
		when: [
			{ situation: Situation.Application },
			{ situation: Situation.Hire },
			{ situation: Situation.Employed }
		],
		legalUrl: 'http://webserver.rilin.state.ri.us/Statutes/TITLE28/28-6/INDEX.htm'
	}),
	new Locale({
		country: 'United States',
		state: 'Nevada',
		stateCode: 'NV',
		strength: Strength.Weak,
		who: {
			// Nevada's definition is unclear
			officeInLocale: true
		},
		when: [{ situation: Situation.Interview }],
		what: {
			salary: true
		},
		legalUrl: 'https://www.leg.state.nv.us/App/NELIS/REL/81st2021/Bill/7896/Text',
		penalty: 'up to $5,000 per violation'
	}),
	new Locale({
		country: 'United States',
		state: 'Ohio',
		stateCode: 'OH',
		city: 'Cincinnati',
		strength: Strength.Weak,
		who: {
			officeInLocale: true,
			minEmployeesInLocale: 15
		},
		what: {
			salary: true
		},
		when: [{ situation: Situation.Offer, requestRequired: true }],
		legalUrl:
			'https://www.cincinnati-oh.gov/cityofcincinnati/equity-in-cincinnati/city-of-cincinnati-s-salary-equity-ordinance/',
		penalty: 'a private cause of action; no enforcement is done by the city'
	}),
	new Locale({
		country: 'United States',
		state: 'Maryland',
		stateCode: 'MD',
		strength: Strength.Strong,
		who: {
			canHireInLocale: true
		},
		what: {
			salary: true,
			benefits: true
		},
		when: [{ situation: Situation.Interested }],
		legalUrl: 'https://mgaleg.maryland.gov/2024RS/chapters_noln/Ch_272_sb0525T.pdf',
		penalty:
			'a letter compelling compliance (first violation); up to $300 per applicant (second violation); $600 per applicant (further violations)',
		reportViolationProcess: 'by submitting a complaint to the Department of Labor',
		referenceUrl: 'https://labor.maryland.gov/labor/wages/',
		referenceSource: 'Maryland Department of Labor'
	}),
	new Locale({
		country: 'United States',
		state: 'New York',
		stateCode: 'NY',
		city: 'Westchester County',
		strength: Strength.Strong,
		who: {
			canHireInLocale: true, // position "required to be performed" in Westchester Cty.
			minEmployees: 4
		},
		what: {
			salary: true
		},
		when: [{ situation: Situation.Interested }],
		legalUrl:
			'https://westchestercountyny.legistar.com/View.ashx?M=F&amp;ID=10917730&amp;GUID=6BB79D87-02B9-48F0-995D-FA1E9940A0E4'
	}),
	new Locale({
		country: 'United States',
		state: 'New York',
		stateCode: 'NY',
		city: 'Ithaca',
		strength: Strength.Strong,
		who: {
			minEmployeesInLocale: 4,
			canHireInLocale: true
		},
		what: {
			salary: true
		},
		when: [{ situation: Situation.Interested }],
		legalUrl: 'https://www.cityofithaca.org/AgendaCenter/ViewFile/Agenda/_05042022-2491',
		referenceSource: 'City of Ithaca',
		referenceUrl: 'https://www.cityofithaca.org/faq.aspx?TID=50'
	}),
	new Locale({
		country: 'United States',
		state: 'New Jersey',
		stateCode: 'NJ',
		city: 'Jersey City',
		strength: Strength.Strong,
		who: {
			canHireInLocale: true,
			minEmployeesInLocale: 5
		},
		what: {
			salary: true
		},
		when: [{ situation: Situation.Interested }],
		legalUrl: 'https://cityofjerseycity.civicweb.net/document/68348/'
	}),
	new Locale({
		country: 'United States',
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
		},
		legalUrl: 'https://codelibrary.amlegal.com/codes/toledo/latest/toledo_oh/0-0-0-159338',
		reportViolationProcess: 'a private cause of action; no enforcement is done by the city'
	}),
	new Locale({
		country: 'United States',
		state: 'New York',
		stateCode: 'NY',
		strength: Strength.Strong,
		what: {
			salary: true
		},
		when: [{ situation: Situation.Interested }],
		who: {
			minEmployees: 4,
			canHireInLocale: true,
			officeSupervisorInLocale: true
		},
		referenceSource: 'New York Department of Labor',
		referenceUrl: 'https://dol.ny.gov/pay-transparency',
		reportViolationProcess: '',
		reportViolationUrl: 'https://dol.ny.gov/pay-transparency',
		legalUrl: 'https://www.nysenate.gov/legislation/bills/2023/S1326'
	}),
	new Locale({
		country: 'United States',
		state: 'Hawaii',
		stateCode: 'HI',
		strength: Strength.Strong,
		what: {
			salary: true
		},
		when: [{ situation: Situation.Interested }],
		who: {
			minEmployees: 50
		},
		referenceSource: 'Hawaii Civil Rights Commission',
		referenceUrl: 'https://labor.hawaii.gov/hcrc/3767-2/',
		legalUrl:
			'https://www.capitol.hawaii.gov/session/archives/measure_indiv_Archives.aspx?billtype=SB&billnumber=1057&year=2023'
	}),
	new Locale({
		country: 'Canada',
		state: 'British Columbia',
		stateCode: 'BC',
		strength: Strength.Strong,
		what: {
			salary: true
		},
		when: [{ situation: Situation.Interested }],
		who: {
			canHireInLocale: true
		},
		referenceSource: 'British Columbia Government',
		referenceUrl: 'https://www2.gov.bc.ca/gov/content/gender-equity/pay-transparency-laws-in-bc',
		legalUrl: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/23018'
	}),
	new Locale({
		country: 'Canada',
		state: 'Prince Edward Island',
		stateCode: 'PE',
		strength: Strength.Strong,
		what: {
			salary: true
		},
		when: [{ situation: Situation.Interested }],
		who: {
			canHireInLocale: true
		},
		referenceUrl:
			'https://www.princeedwardisland.ca/en/information/workforce-advanced-learning-and-population/pay-transparency',
		referenceSource: 'Prince Edward Island',
		legalUrl:
			'https://docs.assembly.pe.ca/download/dms?objectId=2e8abdf3-3f95-463c-b2b0-3ba944edce0d&fileName=bill-119.pdf'
	}),
	new Locale({
		country: 'United States',
		state: 'Washington, D.C.',
		stateCode: 'DC',
		strength: Strength.Strong,
		what: {
			salary: true,
			benefits: true
		},
		when: [{ situation: Situation.Interested }],
		who: {
			minEmployeesInLocale: 1
		},
		legalUrl: 'https://code.dccouncil.gov/us/dc/council/laws/25-138',
		reportViolationProcess: 'by emailing the Office of the D.C. Attorney General',
		reportViolationUrl: 'mailto:workers@dc.gov',
		penalty: 'a lawsuit by D.C. Attorney General with various penalties possible'
	}),
	new Locale({
		country: 'United States',
		state: 'Illinois',
		stateCode: 'IL',
		strength: Strength.Strong,
		/* Illinois specifically exempts out-of-state employers hiring remote, unless they have
			a reason to believe work will be performed in Illinois */
		who: {
			minEmployees: 15,
			canHireInLocale: true,
			requiresPhysicalPresence: true,
			officeSupervisorInLocale: true
		},
		when: [{ situation: Situation.Interested }, { situation: Situation.Application }],
		what: {
			salary: true,
			benefits: true
		},
		referenceUrl:
			'https://labor.illinois.gov/faqs/equal-pay-act-salary-transparency-faq.html#faq-1whatistheillinoisequalpayact-faq',
		reportViolationProcess: 'by making a complaint online to the Illinois Department of Labor',
		reportViolationUrl: 'https://labor.illinois.gov/pay',
		penalty:
			'a notice to cure, followed by fines escalating from a maximum of $500 to a maximum of $10,000',
		legalUrl:
			'https://ilga.gov/legislation/fulltext.asp?DocName=&SessionId=112&GA=103&DocTypeId=SB&DocNum=2038&GAID=17&LegID=&SpecSess=&Session='
	}),
	new Locale({
		country: 'United States',
		state: 'Minnesota',
		stateCode: 'MN',
		strength: Strength.Strong,
		who: {
			minEmployeesInLocale: 30
		},
		what: {
			salary: true,
			benefits: true
		},
		when: [{ situation: Situation.Interested }],
		legalUrl: 'https://www.revisor.mn.gov/statutes/cite/181.173'
	}),
	new Locale({
		country: 'United States',
		state: 'New Jersey',
		stateCode: 'NJ',
		strength: Strength.Strong,
		what: {
			salary: true,
			benefits: true
		},
		who: {
			minEmployees: 10,
			canHireInLocale: true,
			officeInLocale: true
		},
		when: [{ situation: Situation.Interested }],
		penalty: 'fine of up to $600 per violation',
		legalUrl: 'https://pub.njleg.state.nj.us/Bills/2024/AL24/91_.PDF',
		referenceUrl: 'https://www.nj.gov/labor/myworkrights/wages/pay-transparency/',
		reportViolationProcess:
			'by filing a complaint online with the New Jersey Department of Labor and Workforce Development',
		reportViolationUrl:
			'https://www.nj.gov/labor/wageandhour/claims-appeals-investigations/file/#fileonline'
	}),
	new Locale({
		country: 'United States',
		state: 'Vermont',
		stateCode: 'VT',
		strength: Strength.Strong,
		referenceUrl:
			'https://ago.vermont.gov/sites/ago/files/2024-12/Final%20Version%20of%20H%20704%20Guidance%20(12-31-24).pdf',
		legalUrl:
			'https://legislature.vermont.gov/Documents/2024/Docs/ACTS/ACT155/ACT155%20As%20Enacted.pdf',
		who: {
			minEmployeesInLocale: 1,
			minEmployees: 5,
			canHireInLocale: true
		},
		when: [{ situation: Situation.Interested }],
		what: {
			salary: true
		},
		reportViolationProcess:
			"by emailing the Vermont Attorney General's Civil Rights Unit <agocivilrights@vermont.gov>"
	}),
	new Locale({
		country: 'United States',
		state: 'Massachusetts',
		stateCode: 'MA',
		strength: Strength.Strong,
		who: {
			minEmployeesInLocale: 25,
			canHireInLocale: true
		},
		when: [{ situation: Situation.Interested }, { situation: Situation.Employed }],
		what: {
			salary: true
		},
		legalUrl: 'https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter141',
		referenceUrl:
			'https://www.mass.gov/info-details/pay-transparency-in-massachusetts#pay-transparency-faq',
		penalty: 'Warning followed by escalating fines of up to $1,000.',
		reportViolationProcess:
			"by filing a complaint with the Massachusetts Attorney General's office",
		reportViolationUrl: 'https://www.mass.gov/how-to/file-a-workplace-complaint'
	})
].reduce(
	(map, locale) => {
		map[locale.id] = locale;
		return map;
	},
	{} as Record<string, Locale>
);

export const allLocales: Record<string, AbstractLocale> = {
	[OTHER_LOCALE]: new UnknownLocale(),
	[US_REMOTE_LOCALE]: new AllUSLocale(),
	[CA_REMOTE_LOCALE]: new AllCanadaLocale(),
	...locales
};

export { locales, type WhatDisclosure };
