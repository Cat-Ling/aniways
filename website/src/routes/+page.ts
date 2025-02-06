import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return await fetch('http://localhost:8080/anime/recently-updated').then((res) => res.json());
};
