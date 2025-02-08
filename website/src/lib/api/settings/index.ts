import { PUBLIC_API_URL } from '$env/static/public';
import { StatusError } from '$lib/api';
import { settings } from './types';

export const getSettings = async (fetch: typeof global.fetch) => {
	const response = await fetch(`${PUBLIC_API_URL}/settings`)
		.then((res) => {
			if (!res.ok) throw new StatusError(res.status, 'Fetch failed');
			return res;
		})
		.then((res) => res.json());
	return settings.assert(response);
};

export const saveSettings = async (fetch: typeof global.fetch, data: typeof settings.infer) => {
	const response = await fetch(`${PUBLIC_API_URL}/settings`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(settings.assert(data))
	});
	if (response.status === 200) return;
	throw new StatusError(response.status, 'Failed to save settings');
};
