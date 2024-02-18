import { db, orm, schema } from '@aniways/database';
import { scrapeVideoSource } from '@aniways/web-scraping';
import { notFound } from 'next/navigation';

type VideoFrameProps = {
  anime: schema.Anime;
  slug: string;
  currentVideo: schema.Video;
};

export const VideoFrame = async ({
  anime,
  slug,
  currentVideo,
}: VideoFrameProps) => {
  const iframe =
    currentVideo?.videoUrl ||
    (await db
      .update(schema.video)
      .set({
        videoUrl:
          (await scrapeVideoSource(slug)) ||
          (await scrapeVideoSource(slug, 'movie')),
      })
      .where(
        orm.and(
          orm.eq(schema.video.animeId, anime.id),
          orm.eq(schema.video.slug, slug)
        )
      )
      .returning()
      .execute()
      .then(updatedValues => updatedValues[0].videoUrl));

  if (!iframe) notFound();

  return (
    <iframe
      src={iframe}
      className="min-h-[260px] w-full md:aspect-video md:min-h-0"
      frameBorder="0"
      scrolling="no"
      allowFullScreen
    />
  );
};
