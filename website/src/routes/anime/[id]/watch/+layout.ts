import { getServersOfEpisode, getStreamingData } from '$lib/api/anime';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, url, parent, params }) => {
  const parentPromise = parent();

  const episode = Number(url.searchParams.get('episode') || 1);
  let type = url.searchParams.get('type') ?? 'sub';

  if (type !== 'sub' && type !== 'dub') {
    type = 'sub';
  }

  let key = url.searchParams.get('key');
  if (!key) {
    key = (await parentPromise).episodes.find((ep) => ep.number === episode)?.id ?? null;
  }

  if (!key) {
    return error(404, 'Episode not found');
  }

  const servers = await getServersOfEpisode(fetch, key).catch(() => []);
  const availableTypes =
    servers.length === 0 ? ['sub'] : [...new Set(servers.map((server) => server.type))];

  const streamInfo = getStreamingData(fetch, key, type as 'sub' | 'dub').catch(() => {
    throw error(404, 'Streaming data not found');
  });

  return {
    title: `${(await parentPromise).anime.jname} - Episode ${episode}`,
    query: {
      id: params.id,
      episode,
      key,
      type
    },
    data: {
      streamInfo,
      availableTypes
    }
  };
};
