import { getServersOfEpisode, getStreamingData } from '$lib/api/anime';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getHistoryItem } from '$lib/api/library';

export const load: PageLoad = async ({ url, fetch, parent: getParent, params }) => {
	const parent = await getParent();

	const { anime, episodes } = parent;

	const episode = Number(url.searchParams.get('episode') || episodes[0].number);
	const key = url.searchParams.get('key') ?? episodes.find((ep) => ep.number === episode)?.id;
	const server = url.searchParams.get('server') ?? 'sub';
	const type = url.searchParams.get('type');

	if (!key) {
		return error(404, 'Episode not found');
	}

	const servers = await getServersOfEpisode(fetch, key);
	const selectedServer =
		servers.find((srv) => srv.type === type && srv.serverName === server) ??
		servers.find((srv) => srv.type === 'sub' || srv.type === 'raw') ??
		servers[0];

	const serversByType = servers.reduce(
		(acc, srv) => {
			if (!acc[srv.type]) {
				acc[srv.type] = [];
			}

			acc[srv.type].push(srv);

			return acc;
		},
		{} as Record<string, typeof servers>
	);

	const history = await getHistoryItem(fetch, params.id).catch(() => null);

	return {
		title: `${anime.jname} - Episode ${episode}`,
		query: {
			id: params.id,
			episode,
			key,
			server: selectedServer.serverName,
			type: selectedServer.type
		},
		data: {
			...parent,
			servers,
			serversByType,
			selectedServer,
			streamInfo: getStreamingData(fetch, selectedServer.url),
			history
		}
	};
};
