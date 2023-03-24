import { locales } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => locales[params.slug];