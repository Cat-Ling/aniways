import { StatusError } from '$lib/api';
import {
	getAnimeFranchise,
	getAnimeMetadata,
	getEpisodes,
	getRelatedAnime,
	getSeasonsOfAnime,
	getTrailer
} from '$lib/api/anime';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { formatDuration } from 'date-fns/formatDuration';
import { secondsToMinutes } from 'date-fns/secondsToMinutes';
import { anime as animeSchema } from '$lib/api/anime/types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const [anime, episodes] = await Promise.all([
			getAnimeMetadata(fetch, params.id),
			getEpisodes(fetch, params.id)
		]);

		if (!anime.metadata) {
			error(404, 'Anime not found');
		}

		const trailer = anime.metadata.trailer ?? getTrailer(fetch, anime.id).catch(() => null);

		return {
			title: anime.jname,
			anime: formatAnime(anime),
			episodes,
			seasonsAndRelatedAnimes: fetchSeasonsAndRelatedAnimes(fetch, params.id),
			trailer: typeof trailer === 'string' ? trailer : trailer.then((t) => t?.trailer ?? '')
		};
	} catch (e) {
		if (e instanceof StatusError && (e?.status === 400 || e?.status === 404)) {
			error(404, 'Anime not found');
		}

		error(500, 'Failed to load anime');
	}
};

function formatAnime(anime: typeof animeSchema.infer) {
	const metadata = anime.metadata;

	if (!metadata) {
		throw new Error('Impossible to format anime without metadata');
	}

	return {
		...anime,
		...anime.metadata,
		picture: metadata.mainPicture ?? anime.poster,
		score: `${metadata.mean ?? 0.0} (${Intl.NumberFormat().format(metadata.scoringUsers ?? 0)} users)`,
		season: metadata.season ? `${metadata.season} ${metadata.seasonYear}` : '???',
		source: metadata.source?.replace('_', ' ') ?? '???',
		avgEpDuration: formatDuration({
			minutes: secondsToMinutes(metadata.avgEpDuration ?? 0)
		}),
		airing: metadata.airingStart
			? `${metadata.airingStart} - ${metadata.airingEnd ?? '???'}`
			: '???'
	};
}

async function fetchSeasonsAndRelatedAnimes(fetch: typeof global.fetch, animeId: string) {
	const [seasons, related, franchise] = await Promise.all([
		getSeasonsOfAnime(fetch, animeId),
		getRelatedAnime(fetch, animeId),
		getAnimeFranchise(fetch, animeId)
	]);

	if (seasons.length > 1 && seasons.some((a) => a.id === animeId)) {
		return [
			{ label: 'Seasons', value: seasons },
			{ label: 'Related anime', value: related.toReversed() }
		].filter((d) => d.value.length > 0);
	}

	return [
		{ label: 'Seasons', value: [] },
		{ label: 'Related anime', value: franchise.filter((f) => f.id !== animeId).toReversed() }
	].filter((d) => d.value.length > 0);
}
