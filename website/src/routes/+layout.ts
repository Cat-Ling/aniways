import { getCurrentUser } from '$lib/api/auth';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	return {
		user: await getCurrentUser(fetch)
	};
};
