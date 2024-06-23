import { MALClient } from "@animelist/client";

export default async function addToAnimeList(
  accessToken: string,
  malId: number,
) {
  const client = new MALClient({ accessToken });

  const anime = await client.updateMyAnimeListStatus(malId, {
    status: "watching",
    num_watched_episodes: 0,
  });

  return anime;
}
