import { type } from 'arktype';

export const settings = type({
	userId: 'string',
	autoPlayEpisode: 'boolean',
	autoNextEpisode: 'boolean',
	autoUpdateMal: 'boolean',
	autoResumeEpisode: 'boolean'
});
