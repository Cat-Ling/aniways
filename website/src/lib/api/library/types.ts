import { type } from 'arktype';
import { anime } from '../anime/types';

export const libraryStatusSchema = type(
	'"planning"|"watching"|"completed"|"dropped"|"paused"|"all"'
);

export const libraryItemSchema = type({
	id: 'string',
	animeId: 'string',
	userId: 'string',
	watchedEpisodes: 'number.integer',
	status: libraryStatusSchema,
	createdAt: 'number.integer',
	updatedAt: 'number.integer',
	anime
});

export const librarySchema = type({
	pageInfo: type({
		total: 'number.integer',
		perPage: 'number.integer',
		currentPage: 'number.integer',
		lastPage: 'number.integer'
	}),
	items: libraryItemSchema.array()
});

export const historyItemSchema = type({
	id: 'string',
	animeId: 'string',
	userId: 'string',
	watchedEpisodes: 'number.integer',
	createdAt: 'number.integer',
	anime
});

export const historySchema = type({
	pageInfo: type({
		total: 'number.integer',
		perPage: 'number.integer',
		currentPage: 'number.integer',
		lastPage: 'number.integer'
	}),
	items: historyItemSchema.array()
});
