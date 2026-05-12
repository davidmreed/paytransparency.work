import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { z, type ZodType } from 'zod';
import { zfd } from 'zod-form-data';

const QueryParams = z.record(z.coerce.string());

// Adapted from https://github.com/sveltejs/kit/issues/969

export function createQueryStore<K extends ZodType>(paramType: K) {
	const schema = zfd.formData(paramType);

	return {
		subscribe: (h: (input: z.TypeOf<K>) => void) => {
			return page.subscribe((p) => {
				try {
					h(schema.parse(p.url.searchParams));
				} catch (error) {
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

export function asURLSearchParams(p: unknown): URLSearchParams {
	return new URLSearchParams(QueryParams.parse(p));
}

export function asQueryString(p: unknown): string {
	return asURLSearchParams(p).toString();
}
