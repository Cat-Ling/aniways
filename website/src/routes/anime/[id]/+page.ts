import { getAnimeMetadata } from '$lib/api/anime';
import { AxiosError } from 'axios';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	try {
		const anime = await getAnimeMetadata(params.id);

		return {
			title: anime.jname,
			anime
		};
	} catch (e) {
		if (e instanceof AxiosError && (e?.status === 400 || e?.status === 404)) {
			error(404, 'Anime not found');
		}

		error(500, 'Failed to load anime');
	}
};
