import { type } from 'arktype';

export const animeMetadata = type({
	malId: 'number.integer',
	description: 'string',
	mainPicture: 'string.url',
	mediaType: 'string',
	rating: 'string|null',
	avgEpDuration: 'number.integer|null',
	airingStatus: 'string',
	totalEpisodes: 'number.integer|null',
	studio: 'string|null',
	rank: 'number.integer|null',
	mean: 'number|null',
	scoringUsers: 'number.integer',
	popularity: 'number.integer|null',
	airingStart: 'string|null',
	airingEnd: 'string|null',
	source: 'string|null',
	'season?': 'string|null',
	trailer: 'string.url|null'
});

export const anime = type({
	id: 'string.uuid',
	name: 'string',
	jname: 'string',
	poster: 'string.url',
	genre: 'string[]',
	malId: 'number.integer|null',
	anilistId: 'number.integer|null',
	lastEpisode: 'number.integer|null',
	metadata: animeMetadata.or('null').optional()
});

export const anilistAnime = type({
	id: 'string.uuid',
	title: 'string',
	bannerImage: 'string.url|null',
	coverImage: 'string.url',
	description: 'string',
	startDate: 'number.integer',
	type: 'string|null',
	episodes: 'number.integer|null',
	anime: anime
});

export const topAnime = type({
	today: anime.array(),
	week: anime.array(),
	month: anime.array()
});

export const paginatedAnime = type({
	pageInfo: type({
		totalPage: 'number.integer',
		currentPage: 'number.integer',
		hasNextPage: 'boolean',
		hasPreviousPage: 'boolean'
	}),
	items: anime.array()
});

export const trailer = type({
	trailer: 'string.url'
});

export const episode = type({
	id: 'string',
	title: 'string|null',
	number: 'number',
	isFiller: 'boolean'
});

export const episodeServer = type({
	type: 'string',
	serverName: 'string',
	url: 'string.url'
});
