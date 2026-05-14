import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const { goto, mockPage } = vi.hoisted(() => ({
	goto: vi.fn(),
	mockPage: {
		state: { source: 'test' }
	}
}));

vi.mock('$app/environment', () => ({
	browser: true
}));

vi.mock('$app/navigation', () => ({
	goto
}));

vi.mock('$app/state', () => ({
	page: mockPage
}));

import { createUseZodQueryParams } from '$lib/queryParams';

const QuerySchema = z.object({
	foo: z.string().default('')
});

class MockWindow extends EventTarget {
	location: URL;
	history: {
		state: unknown;
		pushState: (state: unknown, unused: string, url?: string | URL | null) => void;
		replaceState: (state: unknown, unused: string, url?: string | URL | null) => void;
	};

	constructor(url: string) {
		super();
		this.location = new URL(url);
		this.history = {
			state: {},
			pushState: (state, _unused, nextUrl) => {
				this.history.state = state;
				if (nextUrl) {
					this.location = new URL(nextUrl, this.location);
				}
			},
			replaceState: (state, _unused, nextUrl) => {
				this.history.state = state;
				if (nextUrl) {
					this.location = new URL(nextUrl, this.location);
				}
			}
		};
	}
}

describe('createUseZodQueryParams', () => {
	beforeEach(() => {
		goto.mockClear();
		Object.defineProperty(globalThis, 'window', {
			value: new MockWindow('https://example.com/find-your-rights#results'),
			configurable: true,
			writable: true
		});
	});

	it('navigates through SvelteKit when query params change', () => {
		const [params] = createUseZodQueryParams(QuerySchema, { replace: true })({
			search: '',
			hash: '#results'
		});

		params.foo = 'bar';

		expect(goto).toHaveBeenCalledWith('/find-your-rights?foo=bar#results', {
			replaceState: true,
			noScroll: true,
			keepFocus: true,
			state: mockPage.state
		});
	});

	it('does not navigate again when a value is unchanged', () => {
		const [params] = createUseZodQueryParams(QuerySchema, { replace: true })({
			search: '?foo=bar',
			hash: '#results'
		});

		params.foo = 'bar';

		expect(goto).not.toHaveBeenCalled();
	});

	it('updates from browser history changes', () => {
		const [params, helpers] = createUseZodQueryParams(QuerySchema)({
			search: '?foo=before',
			hash: ''
		});

		window.history.pushState({}, '', '/find-your-rights?foo=after');
		window.dispatchEvent(new Event('popstate'));

		expect(params.foo).toBe('after');

		helpers.unsubscribe();
	});
});
