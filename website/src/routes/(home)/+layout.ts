import { getSeasonalAnime } from '$lib/api/anime';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const seasonalAnime = await getSeasonalAnime(fetch);

	return {
		seasonalAnime
	};
};
