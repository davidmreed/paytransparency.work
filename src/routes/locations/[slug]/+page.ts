import { data } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => data[params.slug];