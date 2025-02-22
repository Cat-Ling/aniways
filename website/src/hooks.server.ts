import { dev } from '$app/environment';
import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const apiUrl = dev ? 'http://localhost:8080' : 'https://api.aniways.xyz';

	if (request.url.startsWith(apiUrl)) {
		request.headers.set('cookie', event.request.headers.get('cookie') || '');
	}

	return fetch(request);
};
