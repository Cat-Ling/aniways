import type { WatchStatus } from "@animelist/client";
import { MALClient } from "@animelist/client";

export default async function getAnimeList(
  accessToken: string,
  username: string,
  page = 1,
  limit = 20,
  status: WatchStatus | undefined = undefined
) {
  const client = new MALClient({ accessToken });
  const animeList = await client.getUserAnimeList(username, {
    limit,
    offset: (page - 1) * limit,
    fields: [
      "alternative_titles",
      "average_episode_duration",
      "genres",
      "my_list_status",
      "synopsis",
      "num_episodes",
    ],
    status,
    nsfw: true,
    sort: "anime_title",
  });
  return animeList;
}
