
import { z } from 'zod';
import { locales, OTHER_LOCALE, US_REMOTE_LOCALE, type Locale, type WhatDisclosure, Situation } from '$lib/data';


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
    employeeInLocation: z.boolean().default(false),
    totalEmployees: z.number().default(0),
    roleLocation: z
        .string()
        .default('')
        .transform((s) => s.split(','))
        .refine((s) =>
            s.every(
                (l) =>
                    Object.keys(locales).includes(l) ||
                    l === '' ||
                    l === OTHER_LOCALE ||
                    l === US_REMOTE_LOCALE
            )
        ),
});


export interface Match {
    locale: Locale;
    earliestDisclosurePoint: Situation;
    minEmployeesInLocale?: number;
    what: WhatDisclosure;
}
