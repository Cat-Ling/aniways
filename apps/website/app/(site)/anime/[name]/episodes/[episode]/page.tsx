import { getVideoSourceUrl } from '@data/anime';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

const ONE_DAY = 1000 * 60 * 60 * 24;

const cachedGetVideoSourceUrl = unstable_cache(
  getVideoSourceUrl,
  ['video-source-url-name'],
  {
    revalidate: ONE_DAY,
    tags: ['video-source-url-name'],
  }
);

export const generateMetadata = async ({
  params: { name, episode },
}: {
  params: {
    name: string;
    episode: string;
  };
}): Promise<Metadata> => {
  const data = await cachedGetVideoSourceUrl(name, episode);

  if (!data || !data.name) return {};

  return {
    title: `${data.name} - Episode ${episode}`,
    description: `Watch ${data.name} episode ${episode} online for free.`,
  };
};

const AnimeStreamingPage = async ({
  params: { name, episode },
}: {
  params: {
    name: string;
    episode: string;
  };
}) => {
  const iframe = await cachedGetVideoSourceUrl(name, episode);
  const decodedNameFromUrl = decodeURIComponent(name).split('-').join(' ');

  return (
    <>
      <h1 className="mb-3 text-xl font-bold">
        {iframe && iframe.name ? (
          iframe.name
        ) : (
          <span className="capitalize">{decodedNameFromUrl}</span>
        )}{' '}
        -{' '}
        <span className="text-muted-foreground font-normal">
          Episode {episode}
        </span>
      </h1>
      {iframe && iframe.url ? (
        <iframe
          src={iframe.url}
          className="aspect-video w-full overflow-hidden"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
        />
      ) : (
        <p className="text-red-500">
          Sorry, we couldn't find the episode you're looking for. Please try
          again later.
        </p>
      )}
    </>
  );
};

export default AnimeStreamingPage;
