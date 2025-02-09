import { fetchJson } from '$lib/api';
import { formatDuration, secondsToMinutes } from 'date-fns/fp';
import {
	anilistAnime,
	anime,
	episode,
	episodeServer,
	paginatedAnime,
	topAnime,
	trailer
} from './types';
import { error } from '@sveltejs/kit';

export const getSeasonalAnime = async (fetch: typeof global.fetch) => {
	return fetchJson(fetch, '/anime/seasonal', anilistAnime.array());
};

export const getTrendingAnime = async (fetch: typeof global.fetch) => {
	return fetchJson(fetch, '/anime/trending', anime.array());
};

export const getTopAnime = async (fetch: typeof global.fetch) => {
	return fetchJson(fetch, '/anime/top', topAnime);
};

export const getPopularAnime = async (fetch: typeof global.fetch) => {
	return fetchJson(fetch, '/anime/popular', anilistAnime.array());
};

export const getRecentlyUpdatedAnime = async (
	fetch: typeof global.fetch,
	page: number,
	itemsPerPage: number
) => {
	return fetchJson(
		fetch,
		`/anime/recently-updated?page=${page}&itemsPerPage=${itemsPerPage}`,
		paginatedAnime
	);
};

export const searchAnime = async (
	fetch: typeof global.fetch,
	query: string,
	page: number,
	itemsPerPage: number,
	abortSignal?: AbortSignal
) => {
	return fetchJson(fetch, `/anime/search`, paginatedAnime, {
		signal: abortSignal,
		params: { query, page, itemsPerPage }
	});
};

export const getAnimeMetadata = async (fetch: typeof global.fetch, id: string) => {
	const a = await fetchJson(fetch, `/anime/${id}`, anime);

	const metadata = a.metadata;

	if (!metadata) {
		error(404, 'Anime not found');
	}

	return {
		...a,
		...a.metadata,
		metadata: undefined,
		picture: metadata.mainPicture ?? a.poster,
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
};

export const getSeasonsAndRelatedAnimes = async (fetch: typeof global.fetch, id: string) => {
	const [seasons, related, franchise] = await Promise.all([
		fetchJson(fetch, `/anime/${id}/seasons`, anime.array()),
		fetchJson(fetch, `/anime/${id}/related`, anime.array()),
		fetchJson(fetch, `/anime/${id}/franchise`, anime.array())
	]);

	if (seasons.length > 1 && seasons.some((a) => a.id === id)) {
		return [
			{ label: 'Seasons', value: seasons },
			{ label: 'Related anime', value: related.toReversed() }
		].filter((d) => d.value.length > 0);
	}

	return [
		{ label: 'Seasons', value: [] },
		{ label: 'Related anime', value: franchise.filter((f) => f.id !== id).toReversed() }
	].filter((d) => d.value.length > 0);
};

export const getTrailer = async (fetch: typeof global.fetch, id: string, signal?: AbortSignal) => {
	return fetchJson(fetch, `/anime/${id}/trailer`, trailer, { signal });
};

export const getEpisodes = async (fetch: typeof global.fetch, id: string) => {
	return fetchJson(fetch, `/anime/${id}/episodes`, episode.array());
};

export const getServersOfEpisode = async (fetch: typeof global.fetch, episodeId: string) => {
	return fetchJson(fetch, `/anime/episodes/servers/${episodeId}`, episodeServer.array());
};

export const getGenres = async (fetch: typeof global.fetch) => {
	return fetchJson(fetch, '/anime/genres', {
		assert: (data) => data as string[]
	});
};

export const getAnimeByGenre = async (
	fetch: typeof global.fetch,
	genre: string,
	page: number,
	itemsPerPage: number
) => {
	return fetchJson(fetch, `/anime/genres/${genre}`, paginatedAnime, {
		params: { page, itemsPerPage }
	});
};

export const getRandomAnime = async (fetch: typeof global.fetch) => {
	return fetchJson(fetch, '/anime/random', anime);
};

export const getRandomAnimeByGenre = async (fetch: typeof global.fetch, genre: string) => {
	return fetchJson(fetch, `/anime/random/${genre}`, anime);
};
