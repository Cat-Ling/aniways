import {
	getAnimeMetadata,
	getEpisodes,
	getSeasonsAndRelatedAnimes,
	getServersOfEpisode,
	getStreamingData
} from '$lib/api/anime';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, params, fetch }) => {
	const id = params.id;
	const [anime, episodes] = await Promise.all([
		getAnimeMetadata(fetch, id),
		getEpisodes(fetch, id)
	]);

	if (!anime) {
		return error(404, 'Anime not found');
	}

	const episode = Number(url.searchParams.get('episode') || episodes[0].number);
	const key = url.searchParams.get('key') ?? episodes.find((ep) => ep.number === episode)?.id;
	const server = url.searchParams.get('server');

	if (!key) {
		return error(404, 'Episode not found');
	}

	const servers = await getServersOfEpisode(fetch, key);
	const selectedServer =
		servers.find((srv) => {
			const [type, name] = server?.split('_') ?? [];

			return srv.type === type && srv.serverName === name;
		}) ??
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

	return {
		title: `${anime.jname} - Episode ${episode}`,
		query: {
			id,
			episode,
			key,
			server: selectedServer.serverName,
			type: selectedServer.type
		},
		data: {
			anime,
			episodes,
			servers,
			serversByType,
			selectedServer,
			otherAnimeSections: getSeasonsAndRelatedAnimes(fetch, anime.id),
			streamInfo: getStreamingData(fetch, selectedServer.url)
		}
	};
};
