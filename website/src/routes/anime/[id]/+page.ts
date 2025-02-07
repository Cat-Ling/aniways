import { getAnimeMetadata } from '$lib/api/anime';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const anime = await getAnimeMetadata(params.id);

	return {
		title: anime.jname,
		anime
	};
};
