import { db, orm } from '@aniways/database';

export async function getAnimeByIdWithVideos(id: string) {
  return db.query.anime.findFirst({
    where: fields => orm.eq(fields.id, id),
    with: {
      videos: {
        orderBy: fields => orm.asc(fields.episode),
      },
    },
  });
}
