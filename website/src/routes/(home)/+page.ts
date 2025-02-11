import {
	getPopularAnime,
	getRecentlyUpdatedAnime,
	getTopAnime,
	getTrendingAnime
} from '$lib/api/anime';
import type { PageLoad } from './$types';

export const load: PageLoad = async (params) => {
	const [recentlyUpdated, trending, popular, topAnime] = await fetchData(params);

	return {
		title: '',
		recentlyUpdated,
		trending,
		popular,
		topAnime
	};
};

async function fetchData({ fetch, url }: Parameters<PageLoad>[0]) {
	const page = Number(url.searchParams.get('page') || '1');

	return Promise.all([
		getRecentlyUpdatedAnime(fetch, page, 20),
		getTrendingAnime(fetch),
		getPopularAnime(fetch),
		getTopAnime(fetch)
	]);
}
