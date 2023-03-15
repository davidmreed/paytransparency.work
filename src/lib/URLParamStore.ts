import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { z, ZodType } from 'zod';
import { getParams } from 'remix-params-helper';

const QueryParams = z.record(z.coerce.string());

// Adapted from https://github.com/sveltejs/kit/issues/969

export function createQueryStore<T>(paramType: ZodType<T>) {
    let query: T | undefined = undefined;
    return {
        subscribe: (h: (input: T) => void) => {
            return page.subscribe((p) => {
                let parsedResult = getParams(p.url.searchParams, paramType);
                if (parsedResult.success) {
                    h(parsedResult.data);
                }
            });
        },
        set: (v: T) => {
            const queryParams = QueryParams.parse(v);
            const urlSearchParams = new URLSearchParams(queryParams);
            const g = `?${urlSearchParams.toString()}`;
            goto(g, { keepFocus: true, replaceState: false, noScroll: true });
        }
    };
}