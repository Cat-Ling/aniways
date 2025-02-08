import { PUBLIC_API_URL } from '$env/static/public';
import { api } from '$lib/api';
import { user } from './types';

export const getCurrentUser = async () => {
	const response = await api.get('/auth/me');
	return user.assert(response.data);
};

export const getLoginUrl = async (currentPageUrl: string | undefined) => {
	return `${PUBLIC_API_URL}/auth/login${currentPageUrl ? `?redirectUrl=${encodeURIComponent(currentPageUrl)}` : ''}`;
};

export const getLogoutUrl = async (currentPageUrl: string | undefined) => {
	return `${PUBLIC_API_URL}/auth/logout${currentPageUrl ? `?redirectUrl=${encodeURIComponent(currentPageUrl)}` : ''}`;
};
