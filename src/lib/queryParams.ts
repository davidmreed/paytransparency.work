import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { SvelteURLSearchParams } from 'svelte/reactivity';
import type { z, ZodType } from 'zod';
import { zfd } from 'zod-form-data';

type QueryValue = string | string[];
type Query = Record<string, QueryValue>;
type QueryLike = Record<string, QueryValue | undefined>;
type URLLike = Pick<URL, 'search' | 'hash'>;

export interface QueryParamsOptions {
	replace?: boolean;
}

export interface QueryHelpers<TShape extends Record<string, unknown>> {
	readonly raw: Query;
	readonly all: Query & TShape;
	readonly search: string;
	set(params: TShape): void;
	update(params: Partial<TShape>): void;
	remove(...params: (keyof TShape)[]): void;
	unsubscribe(): void;
	keys(): Array<keyof TShape>;
	entries(): Array<[keyof TShape, TShape[keyof TShape]]>;
}

type QueryHook<TShape extends Record<string, unknown>> = (
	url: URLLike
) => [TShape, QueryHelpers<TShape>];

class ReactiveSearchParams extends SvelteURLSearchParams {
	get raw(): Query {
		const raw: Query = {};

		for (const [key, value] of this.entries()) {
			const existing = raw[key];

			if (existing === undefined) {
				raw[key] = value;
			} else if (Array.isArray(existing)) {
				existing.push(value);
			} else {
				raw[key] = [existing, value];
			}
		}

		return raw;
	}

	get uniqueKeys(): string[] {
		return [...new Set(this.keys())];
	}

	get search(): string {
		const value = this.toString();
		return value ? `?${value}` : '';
	}

	clear() {
		for (const key of this.uniqueKeys) {
			this.delete(key);
		}
	}

	setValue(key: string, value: QueryValue | undefined) {
		this.delete(key);

		if (value === undefined) {
			return;
		}

		if (Array.isArray(value)) {
			for (const item of value) {
				this.append(key, item);
			}

			return;
		}

		this.append(key, value);
	}

	setFromObject(query: QueryLike) {
		for (const [key, value] of Object.entries(query)) {
			this.setValue(key, value);
		}
	}

	setFromSearch(query: string) {
		this.clear();

		const params = new URLSearchParams(query);
		for (const [key, value] of params.entries()) {
			this.append(key, value);
		}
	}

	changed(key: string, value: QueryValue | undefined): boolean {
		const compare = value === undefined ? [] : Array.isArray(value) ? value : [value];
		const existing = this.getAll(key).sort();

		if (compare.length !== existing.length) {
			return true;
		}

		const sortedNext = [...compare].sort();
		for (let index = 0; index < existing.length; index += 1) {
			if (existing[index] !== sortedNext[index]) {
				return true;
			}
		}

		return false;
	}
}

function serialiseScalar(value: unknown): string | undefined {
	if (value === undefined || value === null) {
		return undefined;
	}

	if (typeof value === 'string') {
		return value;
	}

	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
		return String(value);
	}

	return JSON.stringify(value);
}

function serialiseValue(value: unknown): QueryValue | undefined {
	if (Array.isArray(value)) {
		const items = value
			.map((item) => serialiseScalar(item))
			.filter((item): item is string => item !== undefined);

		return items.length ? items : undefined;
	}

	return serialiseScalar(value);
}

function serialiseObject(input: Record<string, unknown>): QueryLike {
	return Object.fromEntries(
		Object.entries(input).map(([key, value]) => [key, serialiseValue(value)])
	);
}

export function createUseZodQueryParams<TSchema extends ZodType<Record<string, unknown>>>(
	schema: TSchema,
	options: QueryParamsOptions = {}
): QueryHook<z.infer<TSchema>> {
	const { replace = false } = options;
	const parser = zfd.formData(schema);
	const defaults = schema.parse({});
	const keys = Object.keys(defaults) as Array<keyof z.infer<TSchema>>;
	const searchParams = new ReactiveSearchParams();
	let unsubscribe: (() => void) | undefined;

	function parseCurrent(): z.infer<TSchema> {
		const result = parser.safeParse(searchParams);
		return result.success ? result.data : schema.parse({});
	}

	function persist() {
		if (!browser) {
			return;
		}

		const { pathname, hash } = window.location;
		const next = `${pathname}${searchParams.search}${hash}`;
		// `goto` keeps SvelteKit's router URL/history metadata aligned with the visible URL.
		void goto(next, {
			replaceState: replace,
			noScroll: true,
			keepFocus: true,
			state: page.state
		});
	}

	return function useQueryParams(url: URLLike) {
		searchParams.setFromSearch(url.search);

		if (browser && !unsubscribe) {
			const syncFromLocation = () => searchParams.setFromSearch(window.location.search);

			window.addEventListener('popstate', syncFromLocation);
			unsubscribe = () => window.removeEventListener('popstate', syncFromLocation);
		}

		const params = {} as z.infer<TSchema>;
		for (const key of keys) {
			Object.defineProperty(params, key, {
				enumerable: true,
				configurable: true,
				get() {
					return parseCurrent()[key];
				},
				set(newValue: unknown) {
					const value = serialiseValue(newValue);
					if (!searchParams.changed(key as string, value)) {
						return;
					}

					searchParams.setFromObject({ [key]: value });
					persist();
				}
			});
		}

		return [
			params,
			{
				get raw() {
					return searchParams.raw;
				},
				get all() {
					return { ...searchParams.raw, ...parseCurrent() };
				},
				get search() {
					return searchParams.search;
				},
				set(nextParams) {
					searchParams.clear();
					searchParams.setFromObject(serialiseObject(nextParams));
					persist();
				},
				update(nextParams) {
					searchParams.setFromObject(serialiseObject(nextParams));
					persist();
				},
				remove(...paramsToRemove) {
					for (const param of paramsToRemove) {
						searchParams.delete(param as string);
					}

					persist();
				},
				unsubscribe() {
					unsubscribe?.();
				},
				keys() {
					return [...keys];
				},
				entries() {
					const current = parseCurrent();
					return keys.map((key) => [key, current[key]]);
				}
			}
		];
	};
}
