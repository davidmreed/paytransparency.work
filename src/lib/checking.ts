
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
