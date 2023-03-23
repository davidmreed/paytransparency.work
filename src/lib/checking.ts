
import { z } from 'zod';
import { data, type LocalityData, type WhatDisclosure } from '$lib/data';

export enum Situation {
    Interested,
    Application,
    Interview,
    Offer,
    Hire,
    Employed
}

export const US_REMOTE_LOCALE = 'us';
export const OTHER_LOCALE = 'other';

export const Params = z.object({
    situation: z
        .number()
        .min(Situation.Interested)
        .max(Situation.Employed)
        .default(Situation.Interested),
    userLocation: z
        .string()
        .default('')
        .refine((s) => Object.keys(data).includes(s) || s === '' || s === OTHER_LOCALE),
    companyLocation: z
        .string()
        .default('')
        .refine((s) => Object.keys(data).includes(s) || s === '' || s === OTHER_LOCALE),
    employeeInLocation: z.boolean().default(false),
    totalEmployees: z.number().default(0),
    roleLocation: z
        .string()
        .default('')
        .transform((s) => s.split(','))
        .refine((s) =>
            s.every(
                (l) =>
                    Object.keys(data).includes(l) ||
                    l === '' ||
                    l === OTHER_LOCALE ||
                    l === US_REMOTE_LOCALE
            )
        ),
});

export const isOrInsideLocale = (a: LocalityData, b: LocalityData) =>
    (a.state === b.state && a.city === b.city) || (a.state === b.state && !b.city);

export interface Match {
    localeId: string;
    localeData: LocalityData;
    earliestDisclosurePoint: Situation;
    minEmployeesInLocale?: number;
    what: WhatDisclosure;
}

export const shimDisclosurePoints = (d: LocalityData): Situation[] => {
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
