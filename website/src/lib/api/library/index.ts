import { fetchJson, mutate } from '..';
import {
	historyItemSchema,
	historySchema,
	libraryItemSchema,
	librarySchema,
	libraryStatusSchema,
	runningSchema,
	statusSchema,
	syncStatusResponseSchema
} from './types';

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

export const getContinueWatchingAnime = async (
	fetch: typeof global.fetch,
	page: number,
	itemsPerPage: number
) => {
	return fetchJson(fetch, `/library/continue-watching`, librarySchema, {
		params: {
			page,
			itemsPerPage
		}
	});
};

export const getPlanToWatchAnime = async (
	fetch: typeof global.fetch,
	page: number,
	itemsPerPage: number
) => {
	return fetchJson(fetch, `/library/plan-to-watch`, librarySchema, {
		params: {
			page,
			itemsPerPage
		}
	});
};

export const getLibraryItem = async (fetch: typeof global.fetch, animeId: string) => {
	return fetchJson(fetch, `/library/${animeId}`, libraryItemSchema).catch(() => null);
};

export const getHistoryItem = async (fetch: typeof global.fetch, animeId: string) => {
	return fetchJson(fetch, `/library/${animeId}/history`, historyItemSchema).catch(() => null);
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
	watchedEpisodes: number,
	abortSignal?: AbortSignal
) => {
	return mutate(fetch, `/library/${animeId}/history/${watchedEpisodes}`, {
		method: 'PUT',
		signal: abortSignal
	});
};

export const deleteFromLibrary = async (fetch: typeof global.fetch, animeId: string) => {
	return mutate(fetch, `/library/${animeId}`, {
		method: 'DELETE'
	});
};

export const deleteAllFromLibrary = async (fetch: typeof global.fetch) => {
	return mutate(fetch, `/library`, {
		method: 'DELETE'
	});
};

export const deleteFromHistory = async (fetch: typeof global.fetch, animeId: string) => {
	return mutate(fetch, `/library/${animeId}/history`, {
		method: 'DELETE'
	});
};

export const pullFromMal = async (fetch: typeof global.fetch) => {
	return fetchJson(fetch, '/library/pull/myanimelist', syncStatusResponseSchema, {
		method: 'POST'
	});
};

export const getRunningSyncs = async (fetch: typeof global.fetch) => {
	return fetchJson(fetch, '/library/status/running', runningSchema);
};

export const getSyncStatus = async (fetch: typeof global.fetch, syncId: string) => {
	return fetchJson(fetch, `/library/pull/status/${syncId}`, statusSchema);
};
