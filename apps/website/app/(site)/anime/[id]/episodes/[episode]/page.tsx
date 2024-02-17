import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { db, getAnimeDetails, getVideoSourceUrl } from '@aniways/data-access';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@ui/components/ui/skeleton';

const FIFTEEN_MINUTES_IN_SECONDS = 60 * 15;

const cachedGetVideoSourceUrl = unstable_cache(
  getVideoSourceUrl,
  ['video-source-url-name'],
  {
    revalidate: FIFTEEN_MINUTES_IN_SECONDS,
    tags: ['video-source-url-name'],
  }
);

const cachedGetAnimeDetails = unstable_cache(
  getAnimeDetails,
  ['anime-details-name'],
  {
    revalidate: FIFTEEN_MINUTES_IN_SECONDS,
    tags: ['anime-details-name'],
  }
);

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
      malAnime: true,
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
      malAnime: true,
      videos: true,
    },
  });

  const currentVideo = anime?.videos.find(
    video => Number(video.episode) === Number(episode)
  );

  if (!anime || !currentVideo) notFound();

  return (
    <>
      <h1 className="mb-3 text-xl font-bold">
        {anime.title}-{' '}
        <span className="text-muted-foreground font-normal">
          Episode {episode}
        </span>
      </h1>
      <Suspense fallback={<Skeleton className="aspect-video w-full" />}>
        <VideoFrame
          anime={anime}
          episode={episode}
          slug={currentVideo?.slug.split('-episode-').at(0) ?? anime.slug}
        />
      </Suspense>
    </>
  );
};

type VideoFrameProps = {
  anime: {
    title: string;
  };
  episode: string;
  slug: string;
};

const VideoFrame = async ({ anime, episode, slug }: VideoFrameProps) => {
  let [details, iframe] = await Promise.all([
    cachedGetAnimeDetails(anime.title, Number(episode)),
    cachedGetVideoSourceUrl(slug, episode),
  ]);

  if (!details) notFound();

  if (!iframe) {
    iframe = await getVideoSourceUrl(slug, 'movie');
    if (!iframe) notFound();
  }

  return (
    <>
      <iframe
        src={iframe}
        className="aspect-video w-full overflow-hidden"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      />
      <div className="mt-6 w-full">
        <pre className="bg-muted border-border w-full rounded-md border">
          {JSON.stringify(details, null, 2)}
        </pre>
      </div>
    </>
  );
};

export default AnimeStreamingPage;
