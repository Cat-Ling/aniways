import { notFound } from "next/navigation";

import { api } from "~/trpc/server";
import { VideoPlayer } from "./video-player";

interface VideoFrameProps {
  episode: string;
  animeId: string;
  nextEpisode: string | null;
}

export const VideoFrame = async ({
  animeId,
  episode,
  nextEpisode,
}: VideoFrameProps) => {
  const currentEpisode = await api.episodes.getEpisodeByAnimeIdAndEpisode({
    animeId,
    episode: Number(episode),
  });

  if (!currentEpisode) notFound();

  const streamingSources = await api.episodes.getStreamingSources({
    episodeSlug: currentEpisode.slug,
  });

  return (
    <VideoPlayer
      streamingSources={streamingSources}
      episodeSlug={currentEpisode.slug}
      nextEpisodeUrl={nextEpisode}
    />
  );
};
