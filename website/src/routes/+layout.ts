import { getGenres } from '$lib/api/anime';
import { getCurrentUser } from '$lib/api/auth';
import { getSettings } from '$lib/api/settings';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const [user, settings, genres] = await Promise.all([
		getCurrentUser(fetch).catch(() => null),
		getSettings(fetch).catch(() => null),
		getGenres(fetch)
	]);

	return {
		user,
		settings,
		genres
	};
};
