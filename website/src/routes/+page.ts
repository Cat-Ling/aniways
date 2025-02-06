import { getPopularAnime, getSeasonalAnime, getTopAnime, getTrendingAnime } from '$lib/api/anime';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const seasonal = getSeasonalAnime();
	const top = getTopAnime();
	const popular = getPopularAnime();
	const trending = getTrendingAnime();
	const [seasonalData, topData, popularData, trendingData] = await Promise.all([
		seasonal,
		top,
		popular,
		trending
	]);

	return {
		seasonal: seasonalData,
		top: topData,
		popular: popularData,
		trending: trendingData
	};
};
