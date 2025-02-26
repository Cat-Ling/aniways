import { getAnimeByGenre, getGenres } from '$lib/api/anime';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, url }) => {
  const page = Number(url.searchParams.get('page') || '1');

  const [genres, animes] = await Promise.all([
    getGenres(fetch).then((genres) =>
      genres
        .map((genre) => ({
          slug: genre.replace(/\s/g, '-').toLowerCase(),
          name: genre
        }))
        .filter((genre) => genre.slug !== 'unknown')
    ),
    getAnimeByGenre(fetch, params.genre, page, 20)
  ]);

  return {
    genre: {
      slug: params.genre,
      name: genres.find((genre) => genre.slug === params.genre)?.name || params.genre
    },
    genres,
    animes
  };
};
