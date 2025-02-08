import { getLoginUrl } from '$lib/api/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const ssr = false;

export const load: PageServerLoad = async ({ url }) => {
	const login = await getLoginUrl(url.searchParams.get('redirect') ?? undefined);

	redirect(302, login);
};
