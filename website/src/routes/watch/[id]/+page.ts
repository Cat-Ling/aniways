import { getAnimeMetadata, getEpisodes, getServersOfEpisode } from '$lib/api/anime';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, params }) => {
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
	const selectedServer = servers.find((srv) => srv.serverName === server) ?? servers[0];

	return {
		title: `${anime.jname} - Episode ${episode}`,
		query: {
			id,
			episode,
			key,
			server: selectedServer.serverName
		},
		data: {
			anime,
			episodes,
			servers,
			selectedServer
		}
	};
};
