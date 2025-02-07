import { getRandomAnime } from '$lib/api/anime';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const anime = await getRandomAnime();

	redirect(302, `/anime/${anime.id}`);
};
