import { type } from 'arktype';

export const user = type({
	id: 'number.integer',
	name: 'string',
	picture: 'string.url|null'
});
