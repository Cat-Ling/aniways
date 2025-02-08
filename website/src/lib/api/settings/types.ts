import { type } from 'arktype';

export const settings = type({
	userId: 'number.integer',
	autoPlay: 'boolean',
	autoNextEpisode: 'boolean',
	autoUpdateMal: 'boolean'
});
