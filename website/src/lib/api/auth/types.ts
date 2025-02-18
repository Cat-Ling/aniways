import { type } from 'arktype';

export const user = type({
	id: 'string',
	username: 'string',
	email: 'string.email',
	profilePicture: 'string.url|null'
});

export const loginFormSchema = type({
	email: 'string.email',
	password: 'string > 6'
});
