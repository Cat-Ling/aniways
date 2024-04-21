import { db, orm, schema } from '@aniways/database';
import { getAnimeDetailsFromMyAnimeList } from '@aniways/myanimelist';

type Details = Awaited<ReturnType<typeof getAnimeDetailsFromMyAnimeList>>;

export async function transformRelatedAnime(details: Details) {
  if (!details || !details.relatedAnime || !details.relatedAnime.length) {
    return [];
  }

  const relatedAnime = await Promise.all(
    details.relatedAnime.map(async anime => {
      const id = await db
        .select({
          id: schema.anime.id,
        })
        .from(schema.anime)
        .where(orm.eq(schema.anime.malAnimeId, anime.node.id))
        .then(([data]) => data?.id);

      return {
        ...anime,
        id,
      };
    })
  );

  return relatedAnime;
}
