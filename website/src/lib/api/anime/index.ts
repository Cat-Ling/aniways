import { PUBLIC_API_URL } from '$env/static/public';
import { StatusError } from '$lib/api';
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
	const response = await fetch(`${PUBLIC_API_URL}/anime/seasonal`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return anilistAnime.array().assert(response);
};

export const getTrendingAnime = async (fetch: typeof global.fetch) => {
	const response = await fetch(`${PUBLIC_API_URL}/anime/trending`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return anime.array().assert(response);
};

export const getTopAnime = async (fetch: typeof global.fetch) => {
	const response = await fetch(`${PUBLIC_API_URL}/anime/top`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return topAnime.assert(response);
};

export const getPopularAnime = async (fetch: typeof global.fetch) => {
	const response = await fetch(`${PUBLIC_API_URL}/anime/popular`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return anilistAnime.array().assert(response);
};

export const getRecentlyUpdatedAnime = async (
	fetch: typeof global.fetch,
	page: number,
	itemsPerPage: number
) => {
	const response = await fetch(
		`${PUBLIC_API_URL}/anime/recently-updated?page=${page}&itemsPerPage=${itemsPerPage}`
	)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return paginatedAnime.assert(response);
};

export const searchAnime = async (
	fetch: typeof global.fetch,
	query: string,
	page: number,
	itemsPerPage: number,
	abortSignal?: AbortSignal
) => {
	const response = await fetch(
		`${PUBLIC_API_URL}/anime/search?query=${query}&page=${page}&itemsPerPage=${itemsPerPage}`,
		{
			signal: abortSignal
		}
	)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return paginatedAnime.assert(response);
};

export const getAnimeMetadata = async (fetch: typeof global.fetch, id: string) => {
	const response = await fetch(`${PUBLIC_API_URL}/anime/${id}`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return anime.assert(response);
};

export const getTrailer = async (fetch: typeof global.fetch, id: string) => {
	const response = await fetch(`${PUBLIC_API_URL}/anime/${id}/trailer`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return trailer.assert(response);
};

export const getEpisodes = async (fetch: typeof global.fetch, id: string) => {
	const response = await fetch(`${PUBLIC_API_URL}/anime/${id}/episodes`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return episode.array().assert(response);
};

export const getServersOfEpisode = async (fetch: typeof global.fetch, episodeId: string) => {
	const response = await fetch(`${PUBLIC_API_URL}/anime/episodes/servers/${episodeId}`).then(
		(res) => res.json()
	);
	return episodeServer.array().assert(response);
};

export const getGenres = async (fetch: typeof global.fetch) => {
	const response = await fetch(`${PUBLIC_API_URL}/anime/genres`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return response as string[];
};

export const getAnimeByGenre = async (
	fetch: typeof global.fetch,
	genre: string,
	page: number,
	itemsPerPage: number
) => {
	const response = await fetch(
		`${PUBLIC_API_URL}/anime/genres/${genre}?page=${page}&itemsPerPage=${itemsPerPage}`
	)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return paginatedAnime.assert(response);
};

export const getRandomAnime = async (fetch: typeof global.fetch) => {
	const response = await fetch(`${PUBLIC_API_URL}/anime/random`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return anime.assert(response);
};

export const getRandomAnimeByGenre = async (fetch: typeof global.fetch, genre: string) => {
	const response = await fetch(`${PUBLIC_API_URL}/anime/random/${genre}`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return anime.assert(response);
};
