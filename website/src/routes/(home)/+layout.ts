import { getPopularAnime, getSeasonalAnime, getTopAnime, getTrendingAnime } from '$lib/api/anime';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (params) => {
	const [seasonalAnime, trendingAnime, popularAnime, topAnime] = await fetchData(params);

	return {
		seasonalAnime,
		trendingAnime,
		popularAnime,
		topAnime
	};
};

async function fetchData({ fetch }: Parameters<LayoutLoad>[0]) {
	return Promise.all([
		getSeasonalAnime(fetch),
		getTrendingAnime(fetch),
		getPopularAnime(fetch),
		getTopAnime(fetch)
	]);
}
