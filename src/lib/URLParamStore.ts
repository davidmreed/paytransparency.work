import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { z, type ZodType } from 'zod';
import { getParams } from 'remix-params-helper';

const QueryParams = z.record(z.coerce.string());

// Adapted from https://github.com/sveltejs/kit/issues/969

export function createQueryStore<K extends ZodType>(paramType: K) {
	return {
		subscribe: (h: (input: z.TypeOf<K>) => void) => {
			return page.subscribe((p) => {
				const parsedResult = getParams(p.url.searchParams, paramType);
				if (parsedResult.success) {
					h(parsedResult.data);
				} else {
					h(paramType.parse({}));
					goto('?', { keepFocus: true, replaceState: true, noScroll: false });
				}
			});
		},
		set: (v: z.TypeOf<K>) => {
			const g = `?${asQueryString(v)}`;
			goto(g, { keepFocus: true, replaceState: true, noScroll: true });
		}
	};
}

export function asURLSearchParams(p: any): URLSearchParams {
	return new URLSearchParams(QueryParams.parse(p));
}

export function asQueryString(p: any): string {
	return asURLSearchParams(p).toString();
}
