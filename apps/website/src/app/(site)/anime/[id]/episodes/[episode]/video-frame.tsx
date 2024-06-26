import { notFound } from "next/navigation";

import { createEpisodeService, EpisodeService } from "@aniways/data";

interface VideoFrameProps {
  currentEpisode: string;
  animeId: string;
}

export const VideoFrame = async ({
  animeId,
  currentEpisode,
}: VideoFrameProps) => {
  const { getEpisodeUrl } = createEpisodeService();

  const iframe = await getEpisodeUrl(animeId, currentEpisode).catch(err => {
    if (err === EpisodeService.NOT_FOUND) notFound();
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
