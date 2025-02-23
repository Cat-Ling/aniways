import { StatusError } from '$lib/api';
import {
	getAnimeMetadata,
	getBannerOfAnime,
	getEpisodes,
	getSeasonsAndRelatedAnimes
} from '$lib/api/anime';
import { getLibraryItem } from '$lib/api/library';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, fetch }) => {
	try {
		const banner = getBannerOfAnime(fetch, params.id).catch(() => null);
		const seasonsAndRelatedAnimes = getSeasonsAndRelatedAnimes(fetch, params.id);

		const [anime, episodes, library] = await Promise.all([
			getAnimeMetadata(fetch, params.id),
			getEpisodes(fetch, params.id),
			getLibraryItem(fetch, params.id)
		]);

		return {
			title: anime.jname,
			anime,
			episodes,
			banner,
			seasonsAndRelatedAnimes,
			library
		};
	} catch (e) {
		if (e instanceof StatusError && (e?.status === 400 || e?.status === 404)) {
			error(404, 'Anime not found');
		}

		throw e;
	}
};
