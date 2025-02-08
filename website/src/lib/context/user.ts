import { user } from '$lib/api/auth/types';
import { getContext, hasContext, setContext } from 'svelte';

const key = Symbol('user');

export function setUser(u: typeof user.infer) {
	setContext(key, () => u);
}

export function getUser() {
	return hasContext(key) ? (getContext(key) as () => typeof user.infer) : null;
}
