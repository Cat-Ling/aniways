import { getRandomAnimeByGenre } from '$lib/api/anime';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ fetch, params }) => {
  const anime = await getRandomAnimeByGenre(fetch, params.genre);

  redirect(303, `/anime/${anime.id}`);
};
