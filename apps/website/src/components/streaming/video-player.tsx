import { notFound } from "next/navigation";

import { api } from "~/trpc/server";

import "./streaming.css";

interface VideoFrameProps {
  episode: string;
  animeId: string;
  nextEpisode: string | null;
  malId: number | null;
}

export const VideoPlayer = async ({ animeId, episode }: VideoFrameProps) => {
  const streamingSources = await api.episodes
    .getStreamingSources({
      animeId,
      episode,
    })
    .catch(() => {
      notFound();
    });

  return (
    <iframe
      src={streamingSources.iframe.default}
      className="aspect-video w-full border-0"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      frameBorder="0"
    />
  );

  // return (
  //   <VideoPlayerClient
  //     streamingSources={streamingSources}
  //     nextEpisodeUrl={nextEpisode}
  //     episode={Number(episode)}
  //     malId={malId}
  //   />
  // );
};
