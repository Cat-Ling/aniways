/* eslint-disable no-unused-vars */
import { db, orm, schema } from '@aniways/database';

export const getAnimeById = async (
  id: string,
  withFirstEpisode: boolean = false
) => {
  const anime = await db
    .select()
    .from(schema.anime)
    .where(orm.eq(schema.anime.id, id))
    .limit(1)
    .then(rows => rows[0]);

  if (!anime) return null;

  if (withFirstEpisode) {
    const episodes = await db
      .select({
        episode: schema.video.episode,
      })
      .from(schema.video)
      .where(orm.eq(schema.video.animeId, id))
      .orderBy(orm.asc(schema.video.episode))
      .limit(1)
      .then(rows => rows[0]);

    return { ...anime, firstEpisode: episodes?.episode ?? null };
  }

  return {
    ...anime,
    firstEpisode: null,
  };
};
