import { StatusError } from '$lib/api';
import {
	getAnimeMetadata,
	getBannerOfAnime,
	getEpisodes,
	getSeasonsAndRelatedAnimes
} from '$lib/api/anime';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
	try {
		const [anime, episodes] = await Promise.all([
			getAnimeMetadata(fetch, params.id),
			getEpisodes(fetch, params.id)
		]);

		return {
			title: anime.jname,
			anime,
			episodes,
			banner: getBannerOfAnime(fetch, params.id).catch(() => null),
			seasonsAndRelatedAnimes: getSeasonsAndRelatedAnimes(fetch, params.id)
		};
	} catch (e) {
		if (e instanceof StatusError && (e?.status === 400 || e?.status === 404)) {
			error(404, 'Anime not found');
		}

		throw e;
	}
};
