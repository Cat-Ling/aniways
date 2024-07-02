import { notFound } from "next/navigation";

import { api } from "~/trpc/server";
import { VideoPlayerClient } from "./video-player";

interface VideoFrameProps {
  episode: string;
  animeId: string;
  nextEpisode: string | null;
}

export const VideoPlayer = async ({
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
    <VideoPlayerClient
      streamingSources={streamingSources}
      episodeSlug={currentEpisode.slug}
      nextEpisodeUrl={nextEpisode}
    />
  );
};
