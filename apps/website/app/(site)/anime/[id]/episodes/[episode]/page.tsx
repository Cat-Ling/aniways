import { Metadata } from 'next';
import { db, schema } from '@aniways/database';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@ui/components/ui/skeleton';
import { VideoFrame } from './video-frame';
import { AnimeMetadata } from './anime-metadata';
import { EpisodesSection } from './episodes-section';

export const generateMetadata = async ({
  params: { id, episode },
}: {
  params: {
    id: string;
    episode: string;
  };
}): Promise<Metadata> => {
  const data = await db.query.anime.findFirst({
    where: (fields, actions) => actions.eq(fields.id, id),
    with: {
      genres: true,
      videos: true,
    },
  });

  if (!data || !data.title) return {};

  return {
    title: `${data.title} - Episode ${episode}`,
    description: `Watch ${data.title} episode ${episode} online for free.`,
    openGraph: {
      title: `${data.title} - Episode ${episode}`,
      description: `Watch ${data.title} episode ${episode} online for free.`,
      type: 'video.episode',
      url: `https://aniways.com/${data.slug}/episodes/${episode}`,
      siteName: 'Aniways',
      images: [
        {
          url: data.image,
          alt: `${data.title} - Episode ${episode}`,
        },
      ],
    },
  };
};

const AnimeStreamingPage = async ({
  params: { id, episode },
}: {
  params: {
    id: string;
    episode: string;
  };
}) => {
  const anime = await db.query.anime.findFirst({
    where: (fields, actions) => actions.eq(fields.id, id),
    with: {
      genres: true,
      videos: true,
    },
  });

  const currentVideo = anime?.videos.find(
    video => Number(video.episode) === Number(episode)
  );

  if (!anime || !currentVideo) notFound();

  const episodes = anime.videos
    .sort((a, b) => Number(a.episode) - Number(b.episode))
    .map((video, i) => {
      const nextvideo = anime.videos[i + 1];
      if (nextvideo?.episode === video.episode) {
        return undefined;
      }
      return video;
    })
    .filter(video => video !== undefined) as schema.Video[];

  return (
    <>
      <h1 className="mb-3 text-xl font-bold">
        {anime.title} -{' '}
        <span className="text-muted-foreground font-normal">
          Episode {episode}
        </span>
      </h1>
      <div className="mb-5 flex aspect-video w-full flex-col gap-2">
        <div className="flex-1">
          <Suspense fallback={<Skeleton className="aspect-video w-full" />}>
            <VideoFrame
              anime={anime}
              slug={currentVideo.slug}
              currentVideo={currentVideo}
            />
          </Suspense>
        </div>
        <EpisodesSection
          anime={anime}
          episodes={episodes}
          currentEpisode={episode}
        />
      </div>
      <Suspense fallback={<Skeleton className="mb-6 h-[500px] w-full" />}>
        <AnimeMetadata anime={anime} />
      </Suspense>
    </>
  );
};

export default AnimeStreamingPage;
