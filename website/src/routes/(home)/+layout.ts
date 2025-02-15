import { getPopularAnime, getSeasonalAnime, getTrendingAnime } from '$lib/api/anime';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (params) => {
	const [seasonalAnime, trendingAnime, popularAnime] = await fetchData(params);

	return {
		seasonalAnime,
		trendingAnime,
		popularAnime
	};
};

async function fetchData({ fetch }: Parameters<LayoutLoad>[0]) {
	return Promise.all([getSeasonalAnime(fetch), getTrendingAnime(fetch), getPopularAnime(fetch)]);
}
