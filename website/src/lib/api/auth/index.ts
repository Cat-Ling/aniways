import { PUBLIC_API_URL } from '$env/static/public';
import { StatusError } from '$lib/api';
import { user } from './types';

export const getCurrentUser = async (fetch: typeof global.fetch) => {
	const response = await fetch(`${PUBLIC_API_URL}/auth/me`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return user.assert(response);
};

export const getLoginUrl = async (currentPageUrl: string | undefined) => {
	return `${PUBLIC_API_URL}/auth/login${currentPageUrl ? `?redirectUrl=${encodeURIComponent(currentPageUrl)}` : ''}`;
};

export const getLogoutUrl = async (currentPageUrl: string | undefined) => {
	return `${PUBLIC_API_URL}/auth/logout${currentPageUrl ? `?redirectUrl=${encodeURIComponent(currentPageUrl)}` : ''}`;
};
