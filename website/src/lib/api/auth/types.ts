import { type } from 'arktype';

export const user = type({
	id: 'number.integer',
	username: 'string',
	picture: 'string.url|null'
});
