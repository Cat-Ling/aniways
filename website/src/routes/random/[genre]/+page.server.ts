import { getRandomAnimeByGenre } from '$lib/api/anime';
import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch, params }) => {
  const anime = await getRandomAnimeByGenre(fetch, params.genre);

  redirect(302, `/anime/${anime.id}`);
};
