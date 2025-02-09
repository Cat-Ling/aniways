import { getRecentlyUpdatedAnime } from '$lib/api/anime';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const recentlyUpdatedAnime = await getRecentlyUpdatedAnime(
		fetch,
		Number(url.searchParams.get('page') || '1'),
		25
	);

	return {
		title: '',
		recentlyUpdatedAnime
	};
};
