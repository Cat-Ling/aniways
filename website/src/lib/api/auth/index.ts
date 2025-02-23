import { dev } from '$app/environment';
import { fetchJson, mutate, StatusError } from '$lib/api';
import {
	loginFormSchema,
	profilePictureUploadResultSchema,
	registerFormSchema,
	updatePasswordFormSchema,
	updateUserFormSchema,
	user
} from './types';

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
		body: JSON.stringify(body)
	});
};

export const updateUser = async (
	fetch: typeof global.fetch,
	body: typeof updateUserFormSchema.infer
) => {
	return mutate(fetch, '/users', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			...body,
			password: null,
			confirmPassword: null
		})
	});
};

export const updateUserPassword = async (
	fetch: typeof global.fetch,
	body: typeof updatePasswordFormSchema.infer
) => {
	return mutate(fetch, '/users/password', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
};

export const uploadImage = async (fetch: typeof global.fetch, file: File) => {
	const bytes = await file.arrayBuffer();
	const response = await mutate(fetch, '/users/image', {
		method: 'POST',
		body: bytes,
		headers: {
			'Content-Type': file.type
		}
	});
	return profilePictureUploadResultSchema.assert(await response.json());
};

export const getLogoutUrl = (currentPageUrl: string | undefined) => {
	const apiUrl = dev ? 'http://localhost:8080' : 'https://api.aniways.xyz';
	return `${apiUrl}/auth/logout${currentPageUrl ? `?redirectUrl=${encodeURIComponent(currentPageUrl)}` : ''}`;
};
