import { type } from 'arktype';

export const user = type({
	id: 'string',
	username: 'string',
	email: 'string.email',
	profilePicture: 'string.url|null',
	createdAt: 'number',
	updatedAt: 'number'
});

export const loginFormSchema = type({
	email: 'string.email',
	password: 'string > 6'
});

export const registerFormSchema = type({
	username: 'string',
	email: 'string.email',
	password: 'string > 6',
	confirmPassword: 'string',
	profilePicture: 'string.url|null'
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

export const updateUserFormSchema = type({
	username: 'string',
	email: 'string.email',
	profilePicture: 'string|null'
});

export const profilePictureUploadResultSchema = type({
	url: 'string.url'
});

export const updatePasswordFormSchema = type({
	oldPassword: 'string > 6',
	newPassword: 'string > 6',
	confirmPassword: 'string'
}).narrow((data, ctx) => {
	if (data.newPassword === data.confirmPassword) {
		return true;
	}

	return ctx.reject({
		expected: 'identical to new password',
		actual: '',
		path: ['confirmPassword']
	});
});

export const providerSchema = type("'myanimelist'|'anilist'|'kitsu'");
