import { StatusError } from '$lib/api';
import {
	getAnimeMetadata,
	getEpisodes,
	getSeasonsAndRelatedAnimes,
	getTrailer
} from '$lib/api/anime';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const [anime, episodes] = await Promise.all([
			getAnimeMetadata(fetch, params.id),
			getEpisodes(fetch, params.id)
		]);

		const trailer = anime.trailer ?? getTrailer(fetch, anime.id).catch(() => null);

		return {
			title: anime.jname,
			anime,
			episodes,
			seasonsAndRelatedAnimes: getSeasonsAndRelatedAnimes(fetch, params.id),
			trailer: typeof trailer === 'string' ? trailer : trailer.then((t) => t?.trailer ?? '')
		};
	} catch (e) {
		if (e instanceof StatusError && (e?.status === 400 || e?.status === 404)) {
			error(404, 'Anime not found');
		}

		throw e;
	}
};
