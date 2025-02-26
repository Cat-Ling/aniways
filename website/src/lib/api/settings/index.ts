import { fetchJson, mutate } from '$lib/api';
import { settings } from './types';

export const getSettings = async (fetch: typeof global.fetch) => {
  return fetchJson(fetch, '/settings', settings);
};

export const saveSettings = async (fetch: typeof global.fetch, data: typeof settings.infer) => {
  mutate(fetch, '/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings.assert(data))
  });
};
