/* eslint-disable no-unused-vars */
import { db, orm, schema } from '@aniways/database';

export const getAnimeById = async (
  id: string,
  withVideos: boolean = false
): Promise<
  | (schema.Anime & {
      videos: schema.Video[];
    })
  | undefined
> => {
  if (withVideos) {
    return await db.query.anime.findFirst({
      where: fields => orm.eq(fields.id, id),
      with: {
        videos: {
          orderBy: fields => orm.asc(fields.episode),
        },
      },
    });
  }

  const anime = await db.query.anime.findFirst({
    where: fields => orm.eq(fields.id, id),
  });

  if (!anime) return undefined;

  return {
    ...anime,
    videos: [],
  };
};
