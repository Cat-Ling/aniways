import { getGenres, getRecentlyUpdatedAnime, searchAnime } from '$lib/api/anime';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
	const query = url.searchParams.get('q') || '';
	const page = Number(url.searchParams.get('page') || 1);
	let genre = url.searchParams.get('genre');

	if (genre === 'all' || !genre) {
		genre = null;
	}

	const results = query
		? await searchAnime(fetch, query, genre ?? undefined, page, 24)
		: await getRecentlyUpdatedAnime(fetch, page, 24);
	const genres = await getGenres(fetch);

	return {
		title: query ? `Search results for ${query}` : 'Search',
		query,
		page,
		results,
		genres,
		genre
	};
};
