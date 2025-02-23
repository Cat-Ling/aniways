import { dev } from '$app/environment';
import { fetchJson, mutate, StatusError } from '$lib/api';
import { loginFormSchema, user, registerFormSchema } from './types';

export const getCurrentUser = async (fetch: typeof global.fetch) => {
	return fetchJson(fetch, '/auth/me', user).catch((e) => {
		if (e instanceof StatusError && e.status === 401) return null;
		throw e;
	});
};

export const login = async (fetch: typeof global.fetch, body: typeof loginFormSchema.infer) => {
	return mutate(fetch, '/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
};

export const register = async (
	fetch: typeof global.fetch,
	body: typeof registerFormSchema.infer
) => {
	return mutate(fetch, '/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: body.username,
			email: body.email,
			password: body.password,
			profilePicture: null
		})
	});
};

export const getLogoutUrl = (currentPageUrl: string | undefined) => {
	const apiUrl = dev ? 'http://localhost:8080' : 'https://api.aniways.xyz';
	return `${apiUrl}/auth/logout${currentPageUrl ? `?redirectUrl=${encodeURIComponent(currentPageUrl)}` : ''}`;
};
