import { fetchJson, mutate } from '..';
import { historySchema, librarySchema, libraryStatusSchema } from './types';

export const getLibrary = async (
	fetch: typeof global.fetch,
	page: number,
	itemsPerPage: number,
	status: typeof libraryStatusSchema.infer = 'all'
) => {
	return fetchJson(fetch, `/library`, librarySchema, {
		params: {
			page,
			itemsPerPage,
			status
		}
	});
};

export const getHistory = async (
	fetch: typeof global.fetch,
	page: number,
	itemsPerPage: number
) => {
	return fetchJson(fetch, `/library/history`, historySchema, {
		params: {
			page,
			itemsPerPage
		}
	});
};

export const saveToLibrary = async (
	fetch: typeof global.fetch,
	animeId: string,
	status: typeof libraryStatusSchema.infer,
	watchedEpisodes: number
) => {
	return mutate(fetch, `/library/${animeId}`, {
		method: 'POST',
		params: {
			status,
			epNo: watchedEpisodes
		}
	});
};

export const saveToHistory = async (
	fetch: typeof global.fetch,
	animeId: string,
	watchedEpisodes: number
) => {
	return mutate(fetch, `/library/${animeId}/history/${watchedEpisodes}`, {
		method: 'PUT'
	});
};

export const deleteFromLibrary = async (fetch: typeof global.fetch, animeId: string) => {
	return mutate(fetch, `/library/${animeId}`, {
		method: 'DELETE'
	});
};

export const deleteFromHistory = async (fetch: typeof global.fetch, animeId: string) => {
	return mutate(fetch, `/library/${animeId}/history`, {
		method: 'DELETE'
	});
};
