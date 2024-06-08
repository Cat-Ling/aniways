/* eslint-disable no-unused-vars */
import { db, orm, schema } from '@aniways/database';

type Columns = {
  [key in keyof schema.Anime]: boolean;
};

export const getAnimeById = async (id: string, withVideos: boolean = false) => {
  const anime = await db
    .select()
    .from(schema.anime)
    .where(orm.eq(schema.anime.id, id))
    .limit(1)
    .then(rows => rows[0]);

  if (!anime) return undefined;

  const videos =
    withVideos ?
      await db
        .select()
        .from(schema.video)
        .where(orm.eq(schema.video.animeId, id))
        .orderBy(orm.asc(schema.video.episode))
    : [];

  return {
    ...anime,
    videos: videos,
  };
};
