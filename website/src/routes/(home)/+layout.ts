import { getPopularAnime, getSeasonalAnime, getTrendingAnime } from '$lib/api/anime';
import { getContinueWatchingAnime, getPlanToWatchAnime } from '$lib/api/library';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (params) => {
	const [seasonalAnime, trendingAnime, popularAnime, continueWatching, planToWatch] =
		await fetchData(params);

	return {
		seasonalAnime,
		trendingAnime,
		popularAnime,
		continueWatching,
		planToWatch
	};
};

async function fetchData({ fetch }: Parameters<LayoutLoad>[0]) {
	return Promise.all([
		getSeasonalAnime(fetch),
		getTrendingAnime(fetch),
		getPopularAnime(fetch),
		getContinueWatchingAnime(fetch, 1, 6).catch(() => null),
		getPlanToWatchAnime(fetch, 1, 6).catch(() => null)
	]);
}
