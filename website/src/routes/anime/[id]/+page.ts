import { StatusError } from '$lib/api';
import { getAnimeMetadata, getEpisodes } from '$lib/api/anime';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const [anime, episodes] = await Promise.all([
			getAnimeMetadata(fetch, params.id),
			getEpisodes(fetch, params.id)
		]);

		return {
			title: anime.jname,
			anime,
			episodes
		};
	} catch (e) {
		if (e instanceof StatusError && (e?.status === 400 || e?.status === 404)) {
			error(404, 'Anime not found');
		}

		error(500, 'Failed to load anime');
	}
};
