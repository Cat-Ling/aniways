import { getLibrary } from '$lib/api/library';
import { libraryStatusSchema } from '$lib/api/library/types';
import { ArkErrors } from 'arktype';
import type { PageLoad } from './$types';
import { getInstalledProviders } from '$lib/api/auth';

export const load: PageLoad = async ({ fetch, url }) => {
	const page = Number(url.searchParams.get('page') ?? 1);
	const rawStatus = url.searchParams.get('status');
	let status = libraryStatusSchema(rawStatus);
	if (status instanceof ArkErrors) {
		status = 'all';
	}

	const [library, providers] = await Promise.all([
		getLibrary(fetch, page, 20, status),
		getInstalledProviders(fetch)
	]);

	return {
		library,
		providers,
		status
	};
};
