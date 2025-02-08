import { getRandomAnime } from '$lib/api/anime';
import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	const anime = await getRandomAnime(fetch);

	redirect(302, `/anime/${anime.id}`);
};
