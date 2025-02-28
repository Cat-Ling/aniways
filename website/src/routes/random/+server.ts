import { getRandomAnime } from '$lib/api/anime';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ fetch }) => {
  const anime = await getRandomAnime(fetch);

  redirect(303, `/anime/${anime.id}`);
};
