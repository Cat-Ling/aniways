import { api } from '$lib/api';
import {
	anilistAnime,
	anime,
	episode,
	episodeServer,
	paginatedAnime,
	topAnime,
	trailer
} from './types';

export const getSeasonalAnime = async () => {
	const response = await api.get('/anime/seasonal');
	return anilistAnime.array().assert(response.data);
};

export const getTrendingAnime = async () => {
	const response = await api.get('/anime/trending');
	return anime.array().assert(response.data);
};

export const getTopAnime = async () => {
	const response = await api.get('/anime/top');
	return topAnime.assert(response.data);
};

export const getPopularAnime = async () => {
	const response = await api.get('/anime/popular');
	return anilistAnime.array().assert(response.data);
};

export const getRecentlyUpdatedAnime = async (page: number, itemsPerPage: number) => {
	const response = await api.get('/anime/recently-updated', {
		params: { page, itemsPerPage }
	});
	return paginatedAnime.assert(response.data);
};

export const searchAnime = async (
	query: string,
	page: number,
	itemsPerPage: number,
	abortSignal?: AbortSignal
) => {
	const response = await api.get('/anime/search', {
		params: { query, page, itemsPerPage },
		signal: abortSignal
	});
	return paginatedAnime.assert(response.data);
};

export const getAnimeMetadata = async (id: string) => {
	const response = await api.get(`/anime/${id}`);
	return anime.assert(response.data);
};

export const getTrailer = async (id: string) => {
	const response = await api.get(`/anime/${id}/trailer`);
	return trailer.assert(response.data);
};

export const getEpisodes = async (id: string) => {
	const response = await api.get(`/anime/${id}/episodes`);
	return episode.array().assert(response.data);
};

export const getServersOfEpisode = async (episodeId: string) => {
	const response = await api.get(`/anime/episodes/servers/${episodeId}`);
	return episodeServer.array().assert(response.data);
};

export const getGenres = async () => {
	const response = await api.get('/anime/genres');
	return response.data as string[];
};

export const getAnimeByGenre = async (genre: string, page: number, itemsPerPage: number) => {
	const response = await api.get(`/anime/genres/${genre}`, {
		params: { page, itemsPerPage }
	});
	return paginatedAnime.assert(response.data);
};

export const getRandomAnime = async () => {
	const response = await api.get('/anime/random');
	return anime.assert(response.data);
};

export const getRandomAnimeByGenre = async (genre: string) => {
	const response = await api.get(`/anime/random/${genre}`);
	return anime.assert(response.data);
};
