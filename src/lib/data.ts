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
    onRequest: boolean;
    onExistingEmployeeRequest: boolean;
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
            onRequest: false,
            onExistingEmployeeRequest: false
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
            onRequest: true,
            onExistingEmployeeRequest: true,
            inInterview: false
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
            onRequest: false
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
    }
};

export {
    data,
    type LocalityData
};