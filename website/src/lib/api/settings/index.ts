import { api } from '$lib/api';
import { settings } from './types';

export const getSettings = async () => {
	const response = await api.get('/settings');

	return settings.assert(response.data);
};

export const saveSettings = async (data: typeof settings.infer) => {
	const response = await api.post('/settings', settings.assert(data));
	if (response.status === 200) return;
	throw new Error('Failed to save settings');
};
