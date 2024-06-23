import type { AnimeDetails } from "@aniways/myanimelist";
import { db, orm, schema } from "@aniways/db";

export const getRelatedAnime = async (animeMetadata: AnimeDetails) => {
  if (!animeMetadata.relatedAnime.length) return [];

  const malIds = animeMetadata.relatedAnime.map((anime) => anime.node.id);

  const relatedAnimeMap = await db
    .select({ id: schema.anime.id, malId: schema.anime.malAnimeId })
    .from(schema.anime)
    .where(orm.inArray(schema.anime.malAnimeId, malIds))
    .then((data) => {
      return data.reduce(
        (acc, { id, malId }) => {
          if (!malId) return acc;
          acc[malId] = id;
          return acc;
        },
        {} as Record<number, string>,
      );
    });

  const relatedAnime = animeMetadata.relatedAnime.map((anime) => {
    return {
      ...anime,
      id: relatedAnimeMap[anime.node.id],
    };
  });

  return relatedAnime;
};
