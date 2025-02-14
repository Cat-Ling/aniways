import { type } from 'arktype';

export const settings = type({
	userId: 'number.integer',
	autoPlayEpisode: 'boolean',
	autoNextEpisode: 'boolean',
	autoUpdateMal: 'boolean'
});
