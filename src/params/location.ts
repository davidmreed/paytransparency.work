import { data } from '$lib/data';

export function match(param: string): boolean {
    return /^[a-z]+(\/[a-z])*/.test(param) && param in data;
}