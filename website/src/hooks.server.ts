import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith(PUBLIC_API_URL)) {
		request.headers.set('cookie', event.request.headers.get('cookie') || '');
	}

	if (!browser) {
		return fetch(request);
	}

	return fetch(request, {
		credentials: 'include'
	});
};
