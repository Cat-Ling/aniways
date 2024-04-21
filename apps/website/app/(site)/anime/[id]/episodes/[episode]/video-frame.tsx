import { getVideoUrlByAnimeAndEpisode } from '@aniways/data';
import { notFound } from 'next/navigation';

type VideoFrameProps = {
  currentEpisode: string;
  animeId: string;
};

export const VideoFrame = async ({
  animeId,
  currentEpisode,
}: VideoFrameProps) => {
  const iframe = await getVideoUrlByAnimeAndEpisode(
    animeId,
    currentEpisode
  ).catch(err => {
    if (err === getVideoUrlByAnimeAndEpisode.NOT_FOUND) notFound();
    throw err;
  });

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
