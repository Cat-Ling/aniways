import { Jikan4 } from 'node-myanimelist';
import { MALClient } from '@animelist/client';

export default async function getAnimeDetails(
  accessToken: string | undefined,
  name: string,
  episode?: number
) {
  // TODO: add more sources, get from gogoanime, use the data to search on mal for more accurate data

  console.log('searching for anime', name);

  const client = new MALClient(
    accessToken ?
      { accessToken }
    : {
        // eslint-disable-next-line
        clientId: process.env.MAL_CLIENT_ID!,
      }
  );

  const data = (
    await client.getAnimeList({
      q: name,
      fields: [
        'id',
        'title',
        'media_type',
        'status',
        'start_date',
        'end_date',
        'start_season',
        'synopsis',
        'background',
        'source',
        'genres',
        'alternative_titles',
        'rating',
        'rank',
        'popularity',
        'mean',
        'average_episode_duration',
        'num_episodes',
        'num_list_users',
        'num_scoring_users',
        'my_list_status',
        'recommendations',
        'main_picture',
        'pictures',
        'broadcast',
        'studios',
        'nsfw',
        'statistics',
        'related_anime',
        'related_manga',
      ],
    })
  ).data
    .map(anime => anime.node)
    .at(0);

  if (!data || !data.id) {
    return undefined;
  }

  const anime = Jikan4.anime(data.id);

  const episodes = await anime.episodes();

  const currentEpisode = episode ? (await anime.episode(episode)).data : null;

  if (
    episodes.data.length &&
    currentEpisode &&
    episodes.data.every(ep => ep.mal_id !== currentEpisode.mal_id)
  ) {
    episodes.data.push(currentEpisode);
  }

  return {
    ...data,
    episodes: episodes.data.map(ep => ({
      ...ep,
      current: currentEpisode?.mal_id === ep.mal_id,
    })),
  };
}
