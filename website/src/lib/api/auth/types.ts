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

export const registerFormSchema = type({
	username: 'string',
	email: 'string.email',
	password: 'string > 6',
	confirmPassword: 'string'
}).narrow((data, ctx) => {
	if (data.password === data.confirmPassword) {
		return true;
	}

	return ctx.reject({
		expected: 'identical to password',
		actual: '',
		path: ['confirmPassword']
	});
});
