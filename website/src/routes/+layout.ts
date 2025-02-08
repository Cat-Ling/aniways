import { getCurrentUser } from '$lib/api/auth';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ fetch }) => {
	return getCurrentUser(fetch);
};
