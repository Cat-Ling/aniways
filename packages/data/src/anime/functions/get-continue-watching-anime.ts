import { db, orm, schema } from "@aniways/db";
import { getAnimeList } from "@aniways/myanimelist";

export async function getContinueWatchingAnime(
  accessToken: string,
  username: string,
) {
  const animeList = await getAnimeList(
    accessToken,
    username,
    1,
    50,
    "watching",
  );

  const currentlyWatchingAnime = await db
    .select({
      id: schema.anime.id,
      title: schema.anime.title,
      image: schema.anime.image,
      malAnimeId: schema.anime.malAnimeId,
      lastEpisode: schema.anime.lastEpisode,
    })
    .from(schema.anime)
    .where(
      orm.inArray(
        schema.anime.malAnimeId,
        animeList.data.map(({ node }) => node.id),
      ),
    );

  const animeListMap = animeList.data.reduce(
    (acc, { node }) => {
      acc[node.id] = node;
      return acc;
    },
    {} as Record<number, (typeof animeList)["data"][number]["node"]>,
  );

  return (
    currentlyWatchingAnime
      // embed last watched episode and last updated at
      .map((anime) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { my_list_status } = animeListMap[anime.malAnimeId!]!;

        return {
          ...anime,
          lastWatchedEpisode: my_list_status?.num_episodes_watched,
          lastUpdatedAt: my_list_status?.updated_at,
        };
      })
      // filter out animes that have all episodes watched
      .filter((anime) => {
        const lastEpisodeReleased = Number(anime.lastEpisode);

        return anime.lastWatchedEpisode !== lastEpisodeReleased;
      })
      // transfrom last watched episode to next episode to watch
      .map((anime) => {
        const episodesWatched = anime.lastWatchedEpisode;

        const lastEpisode = String(
          episodesWatched !== undefined
            ? episodesWatched + 1
            : anime.lastEpisode,
        );

        return {
          ...anime,
          lastEpisode,
        };
      })
      // sort by last updated at
      .sort((a, b) => {
        if (!a.lastUpdatedAt || !b.lastUpdatedAt) return 0;

        return new Date(a.lastUpdatedAt) > new Date(b.lastUpdatedAt) ? -1 : 1;
      })
  );
}
