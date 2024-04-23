import { db, orm } from '@aniways/database';

export async function getAnimeById(id: string, withVideos: boolean = false) {
  return db.query.anime.findFirst({
    where: fields => orm.eq(fields.id, id),
    ...(withVideos ?
      {
        with: {
          videos: {
            orderBy: fields => orm.asc(fields.episode),
          },
        },
      }
    : {}),
  });
}
