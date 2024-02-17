import { db, getVideoSourceUrl, orm, schema } from '@aniways/data-access';
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
          (await getVideoSourceUrl(slug)) ||
          (await getVideoSourceUrl(slug, 'movie')),
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
      className="aspect-video w-full md:overflow-hidden"
      frameBorder="0"
      scrolling="no"
      allowFullScreen
    />
  );
};
