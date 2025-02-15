import type { user } from '$lib/api/auth/types';
import { settings } from '$lib/api/settings/types';
import { ArkErrors } from 'arktype';

type State = {
	settings: Omit<typeof settings.infer, 'userId'>;
	user: typeof user.infer | null;
	searchOpen: boolean;
};

function getDefaultSettings(): State['settings'] {
	if (typeof localStorage !== 'undefined' && localStorage.getItem('settings')) {
		const s = JSON.parse(localStorage.getItem('settings')!);
		const parsed = settings(s);
		if (parsed instanceof ArkErrors === false) {
			return parsed;
		}
	}

	return {
		autoNextEpisode: true,
		autoPlayEpisode: true,
		autoUpdateMal: false
	};
}

export const appState = $state<State>({
	settings: getDefaultSettings(),
	user: null,
	searchOpen: false
});

export function setUser(u: State['user']) {
	appState.user = u;
}

export function setSettings(s: State['settings']) {
	appState.settings = s;
}
