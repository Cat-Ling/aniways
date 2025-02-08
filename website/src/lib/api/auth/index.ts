import { PUBLIC_API_URL } from '$env/static/public';
import { fetchJson } from '$lib/api';
import { user } from './types';

export const getCurrentUser = async (fetch: typeof global.fetch) => {
	return fetchJson(fetch, '/auth/me', user);
};

export const getLoginUrl = async (currentPageUrl: string | undefined) => {
	return `${PUBLIC_API_URL}/auth/login${currentPageUrl ? `?redirectUrl=${encodeURIComponent(currentPageUrl)}` : ''}`;
};

export const getLogoutUrl = async (currentPageUrl: string | undefined) => {
	return `${PUBLIC_API_URL}/auth/logout${currentPageUrl ? `?redirectUrl=${encodeURIComponent(currentPageUrl)}` : ''}`;
};
