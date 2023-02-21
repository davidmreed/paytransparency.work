interface LocalityData {
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
    when: WhenDisclosure;
    what: WhatDisclosure,
    penalty?: string;
}

interface WhoDisclosure {
    officeInLocale?: boolean;
    canHireInLocale?: boolean;
    minEmployees?: number;
    minEmployeesInLocale?: number;
}

interface WhenDisclosure {
    inPosting?: boolean;
    afterInterview?: boolean;
    onApplicantRequest?: boolean;
    onExistingEmployeeRequest?: boolean;
    onHire?: boolean;
    onOffer?: boolean;
    requestRequired?: boolean;
}

interface WhatDisclosure {
    salary?: boolean;
    benefits?: boolean;
}

enum Strength {
    Weak = "weak",
    Moderate = "moderate",
    Strong = "strong",
}


let data: Record<string, LocalityData> = {
    'colorado': {
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
        when: {
            inPosting: true,
        },
        what: {
            salary: true,
            benefits: true
        },
        penalty: 'between $500 and $10,000 per violation'
    },
    'california': {
        // Note: the California disclosure requirements upon request
        // do not require that the 15-employee minimum is met.
        state: 'California',
        stateCode: 'CA',
        strength: Strength.Strong,
        when: {
            inPosting: true,
            onExistingEmployeeRequest: true,
        },
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
    },
    'washington': {
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
        when: {
            inPosting: true,
        },
        what: {
            salary: true,
            benefits: true
        },
        referenceUrl: 'https://lni.wa.gov/workers-rights/wages/equal-pay-opportunities-act/#job-postings',
        referenceSource: 'Washington Department of Labor & Industries',
        legalUrl: 'https://app.leg.wa.gov/RCW/default.aspx?cite=49.58.110',
        reportViolationUrl: 'https://lni.wa.gov/workers-rights/workplace-complaints/index',
        reportViolationProcess: 'by filing a complaint online with the Washington Department of Labor & Industries'
    },
    'connecticut': {
        state: 'Connecticut',
        stateCode: 'CT',
        strength: Strength.Moderate,
        who: {
            officeInLocale: true,
        },
        what: {
            salary: true,
        },
        when: {
            onApplicantRequest: true,
            onExistingEmployeeRequest: true,
            onHire: true,
            onOffer: true,
        },
        legalUrl: 'https://cga.ct.gov/2021/act/pa/pdf/2021PA-00030-R00HB-06380-PA.pdf',
        referenceUrl: "https://portal.ct.gov/dolui/salary-range-disclosure-law-faqs",
        referenceSource: 'Connecticut Department of Labor',
        reportViolationProcess: 'by filing a complaint with the Labor Commissioner',
    },
    'new-york-city': {
        state: 'New York',
        stateCode: 'NY',
        city: 'New York',
        strength: Strength.Strong,
        who: {
            minEmployees: 4,
            minEmployeesInLocale: 1,
            canHireInLocale: true,
        },
        what: {
            salary: true,
        },
        when: {
            inPosting: true,
        },
        referenceSource: 'New York Commission on Human Rights',
        referenceUrl: 'https://www.nyc.gov/site/cchr/media/pay-transparency.page',
        reportViolationUrl: 'https://www.nyc.gov/site/cchr/about/report-discrimination.page',
        penalty: 'up to $250,000 if employer does not come into compliance, or for second offenses'
    },
    'rhode-island': {
        state: 'Rhode Island',
        stateCode: 'RI',
        strength: Strength.Moderate,
        who: {
            // Rhode Island's definition is unclear.
            officeInLocale: true
        },
        what: {
            salary: true,
        },
        when: {
            onApplicantRequest: true,
            onHire: true,
            onExistingEmployeeRequest: true
        },
        legalUrl: 'http://webserver.rilin.state.ri.us/Statutes/TITLE28/28-6/INDEX.htm',
    },
    'nevada': {
        state: 'Nevada',
        stateCode: 'NV',
        strength: Strength.Weak,
        who: {
            // Nevada's definition is unclear
            officeInLocale: true,
        },
        when: {
            afterInterview: true,
        },
        what: {
            salary: true,
        },
        legalUrl: 'https://www.leg.state.nv.us/App/NELIS/REL/81st2021/Bill/7896/Text',
        penalty: 'up to $5,000 per violation',
    },
    'ohio-cincinnati': {
        state: 'Ohio',
        stateCode: 'OH',
        city: 'Cincinnati',
        strength: Strength.Weak,
        who: {
            officeInLocale: true,
            minEmployeesInLocale: 15,
        },
        what: {
            salary: true,
        },
        when: {
            onOffer: true,
            requestRequired: true
        },
        legalUrl: 'https://www.cincinnati-oh.gov/cityofcincinnati/equity-in-cincinnati/city-of-cincinnati-s-salary-equity-ordinance/',
        penalty: 'a private cause of action; no enforcement is done by the city'
    },
    'maryland': {
        state: 'Maryland',
        stateCode: 'MD',
        strength: Strength.Weak,
        who: {
            // Maryland's criteria are unclear: 
            // "(i) a person engaged in a business, industry, profession, trade, or other enterprise in the State;"
            officeInLocale: true
        },
        what: {
            salary: true,
        },
        when: {
            onApplicantRequest: true
        },
        legalUrl: 'https://legiscan.com/MD/bill/HB123/2020',
        penalty: 'a letter compelling compliance (first violation); up to $300 per applicant (second violation); $600 per applicant (further violations)',
        reportViolationProcess: 'by submitting a complaint to the Department of Labor'
    },
    'new-york-westchester-county': {
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
        when: {
            inPosting: true
        },
        legalUrl: 'https://westchestercountyny.legistar.com/View.ashx?M=F&amp;ID=10917730&amp;GUID=6BB79D87-02B9-48F0-995D-FA1E9940A0E4'
    },
    'new-york-ithaca': {
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
        when: {
            inPosting: true
        },
        legalUrl: 'https://www.cityofithaca.org/AgendaCenter/ViewFile/Agenda/_05042022-2491',
        referenceSource: 'City of Ithaca',
        referenceUrl: 'https://www.cityofithaca.org/faq.aspx?TID=50'
    },
    'new-jersey-jersey-city': {
        state: 'New Jersey',
        stateCode: 'NJ',
        city: 'Jersey City',
        strength: Strength.Strong,
        who: {
            canHireInLocale: true,
            minEmployeesInLocale: 5
        },
        what: {
            salary: true,
        },
        when: {
            inPosting: true
        },
        legalUrl: 'https://cityofjerseycity.civicweb.net/document/68348/'
    },
    'toledo-ohio': {
        state: 'Ohio',
        stateCode: 'OH',
        city: 'Toledo',
        strength: Strength.Weak,
        what: {
            salary: true
        },
        when: {
            onOffer: true,
            requestRequired: true
        },
        who: {
            minEmployeesInLocale: 15,
            officeInLocale: true,
        },
        legalUrl: 'https://codelibrary.amlegal.com/codes/toledo/latest/toledo_oh/0-0-0-159338',
        reportViolationProcess: 'a private cause of action; no enforcement is done by the city'
    }
};

export {
    data,
    type LocalityData
};