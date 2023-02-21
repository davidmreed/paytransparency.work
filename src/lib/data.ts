interface LocalityData {
    state: string;
    stateCode: string;
    city?: string;
    referenceSource: string;
    referenceUrl: string;
    legalUrl?: string;
    reportViolationUrl?: string;
    reportViolationProcess?: string;
    who: WhoDisclosure;
    when: WhenDisclosure;
    what: WhatDisclosure,
    penalty?: string;
}

interface WhoDisclosure {
    officeInLocale: boolean;
    employeeInLocale: boolean;
    canHireInLocale: boolean;
    minEmployees?: number
}

interface WhenDisclosure {
    inPosting: boolean;
    inInterview: boolean;
    onApplicantRequest: boolean;
    onExistingEmployeeRequest: boolean;
    onHire: boolean;
    onOffer: boolean;
}

interface WhatDisclosure {
    salary: boolean;
    benefits: boolean;
}


let data: Record<string, LocalityData> = {
    'colorado': {
        state: 'Colorado',
        stateCode: 'CO',
        referenceSource: 'Colorado Department of Labor and Enforcement',
        referenceUrl: 'https://cdle.colorado.gov/equalpaytransparency',
        reportViolationUrl: 'https://cdle.colorado.gov/equalpaytransparency',
        reportViolationProcess: 'by submitting a PDF form via email',
        who: {
            officeInLocale: true,
            employeeInLocale: true,
            canHireInLocale: false
        },
        when: {
            inPosting: true,
            inInterview: false,
            onApplicantRequest: false,
            onExistingEmployeeRequest: false,
            onHire: false,
            onOffer: false
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
        when: {
            inPosting: true,
            onApplicantRequest: false,
            onExistingEmployeeRequest: true,
            inInterview: false,
            onHire: false,
            onOffer: false
        },
        who: {
            minEmployees: 15,
            canHireInLocale: true,
            officeInLocale: false,
            employeeInLocale: true
        },
        what: {
            salary: true,
            benefits: false
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
        who: {
            minEmployees: 15,
            employeeInLocale: true,
            canHireInLocale: true,
            officeInLocale: false
        },
        when: {
            inPosting: true,
            inInterview: false,
            onExistingEmployeeRequest: false,
            onApplicantRequest: false,
            onHire: false,
            onOffer: false
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
        who: {
            officeInLocale: true,
            employeeInLocale: false,
            canHireInLocale: false
        },
        what: {
            salary: true,
            benefits: false
        },
        when: {
            inPosting: false,
            inInterview: false,
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
        who: {
            minEmployees: 4,
            employeeInLocale: true,
            canHireInLocale: true,
            officeInLocale: false
        },
        what: {
            salary: true,
            benefits: false
        },
        when: {
            inPosting: true,
            inInterview: false,
            onApplicantRequest: false,
            onExistingEmployeeRequest: false,
            onHire: false,
            onOffer: false
        },
        referenceSource: 'New York Commission on Human Rights',
        referenceUrl: 'https://www.nyc.gov/site/cchr/media/pay-transparency.page',
        reportViolationUrl: 'https://www.nyc.gov/site/cchr/about/report-discrimination.page',
        penalty: 'up to $250,000 if employer does not come into compliance, or for second offenses'
    }
};

export {
    data,
    type LocalityData
};