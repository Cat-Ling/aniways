import { db, orm, schema } from '@aniways/db';
import { scrapeVideoSource } from '@aniways/web-scraping';

const NOT_FOUND = 'not-found' as const;

export async function _getEpisodeUrl(animeId: string, currentEpisode: string) {
  const video = await db
    .select()
    .from(schema.video)
    .where(
      orm.and(
        orm.eq(schema.video.animeId, animeId),
        orm.eq(schema.video.episode, currentEpisode)
      )
    )
    .then(([data]) => data);

  if (!video) throw NOT_FOUND;

  const { videoUrl, slug } = video;

  if (!videoUrl) {
    const scrapedUrl =
      (await scrapeVideoSource(slug)) ||
      (await scrapeVideoSource(slug, 'movie'));

    const result = await db
      .update(schema.video)
      .set({
        videoUrl: scrapedUrl,
      })
      .where(
        orm.and(
          orm.eq(schema.video.animeId, animeId),
          orm.eq(schema.video.slug, slug)
        )
      )
      .returning()
      .then(([updatedValues]) => updatedValues);

    if (!result || !result.videoUrl) throw NOT_FOUND;

    return result.videoUrl;
  }

  return videoUrl;
}

export const getEpisodeUrl = Object.assign(_getEpisodeUrl, {
  NOT_FOUND,
});
