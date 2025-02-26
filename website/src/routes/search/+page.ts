import { getGenres, getRecentlyUpdatedAnime, searchAnime } from '$lib/api/anime';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
  const query = url.searchParams.get('q') || '';
  const page = Number(url.searchParams.get('page') || 1);
  let genre = url.searchParams.get('genre');

  if (genre === 'all' || !genre || genre === 'undefined') {
    genre = null;
  }

  let results;

  if (query) {
    results = await searchAnime(fetch, query, genre ?? undefined, page, 20);
  } else {
    if (genre) {
      results = await searchAnime(fetch, query, genre, page, 20);
    } else {
      results = await getRecentlyUpdatedAnime(fetch, page, 20);
    }
  }

  const genres = await getGenres(fetch).then((genres) =>
    genres.sort((a, b) => a.localeCompare(b)).filter((g) => g !== 'unknown')
  );

  return {
    title: query ? `Search results for ${query}` : 'Search',
    query,
    page,
    results,
    genres,
    genre
  };
};
