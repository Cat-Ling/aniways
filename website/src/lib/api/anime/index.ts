import { fetchJson } from '$lib/api';
import {
	anilistAnime,
	anime,
	episode,
	episodeServer,
	paginatedAnime,
	topAnime,
	trailer
} from './types';

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
	return fetchJson(fetch, `/anime/${id}`, anime);
};

export const getSeasonsOfAnime = async (fetch: typeof global.fetch, id: string) => {
	return fetchJson(fetch, `/anime/${id}/seasons`, anime.array());
};

export const getRelatedAnime = async (fetch: typeof global.fetch, id: string) => {
	return fetchJson(fetch, `/anime/${id}/related`, anime.array());
};

export const getAnimeFranchise = async (fetch: typeof global.fetch, id: string) => {
	return fetchJson(fetch, `/anime/${id}/franchise`, anime.array());
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
