import { MALClient } from '@animelist/client';

export default async function getAnimeList(
  accessToken: string,
  page: number = 1,
  limit: number = 20
) {
  const client = new MALClient({ accessToken });
  const user = await client.getMyUserInfo();
  const animeList = await client.getUserAnimeList(user.name, {
    limit,
    offset: (page - 1) * limit,
    fields: [
      'alternative_titles',
      'average_episode_duration',
      'genres',
      'my_list_status',
      'synopsis',
    ],
  });
  return animeList;
}
