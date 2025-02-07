import { getSeasonalAnime } from '$lib/api/anime';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	const seasonalAnime = await getSeasonalAnime();

	return {
		seasonalAnime
	};
};
