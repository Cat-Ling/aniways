import { type } from 'arktype';

export const settings = type({
	userId: 'string',
	autoPlayEpisode: 'boolean',
	autoNextEpisode: 'boolean',
	incognitoMode: 'boolean',
	autoResumeEpisode: 'boolean'
});
