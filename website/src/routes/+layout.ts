import { getCurrentUser } from '$lib/api/auth';
import { getSettings } from '$lib/api/settings';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	return {
		user: getCurrentUser(fetch).catch(() => null),
		settings: getSettings(fetch).catch(() => null)
	};
};
