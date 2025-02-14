import type { settings as settingsSchema } from '$lib/api/settings/types';
import { getContext, setContext } from 'svelte';

const key = Symbol('settings');

export function setSettings(settings: typeof settingsSchema.infer) {
	setContext(key, () => settings);
}

export function getSettings() {
	return getContext(key) as () => typeof settingsSchema.infer;
}
