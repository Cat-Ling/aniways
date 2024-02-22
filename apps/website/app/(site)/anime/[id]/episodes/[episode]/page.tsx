import { Metadata } from 'next';
import { db } from '@aniways/database';
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
  });

  if (!anime) notFound();

  return (
    <>
      <div className="mb-3">
        <h1 className="text-xl font-bold">{anime.title}</h1>
        <h2 className="text-muted-foreground text-lg font-normal">
          Episode {episode}
        </h2>
      </div>
      <div className="mb-5 flex aspect-video w-full flex-col gap-2">
        <div className="flex-1">
          <Suspense fallback={<Skeleton className="aspect-video w-full" />}>
            <VideoFrame anime={anime} currentEpisode={episode} />
          </Suspense>
        </div>
        <Suspense
          fallback={
            <>
              <Skeleton className="mb-6 mt-3 h-10 w-full" />
              <h2 className="mb-3 text-lg font-semibold">Episodes</h2>
              <Skeleton className="mb-6 h-10 w-full" />
            </>
          }
        >
          <EpisodesSection anime={anime} currentEpisode={episode} />
        </Suspense>
      </div>
      <Suspense fallback={<Skeleton className="mb-6 h-[500px] w-full" />}>
        <AnimeMetadata anime={anime} />
      </Suspense>
    </>
  );
};

export default AnimeStreamingPage;
