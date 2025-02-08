import { getLogoutUrl } from '$lib/api/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const logout = await getLogoutUrl(url.searchParams.get('redirect') ?? undefined);

	redirect(302, logout);
};
