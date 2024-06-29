import { notFound } from "next/navigation";

import { api } from "~/trpc/server";

interface VideoFrameProps {
  episode: string;
  animeId: string;
}

export const VideoFrame = async ({ animeId, episode }: VideoFrameProps) => {
  const currentEpisode = await api.episodes.getEpisodeByAnimeIdAndEpisode({
    animeId,
    episode: Number(episode),
  });

  if (!currentEpisode) notFound();

  const json = await api.episodes.getStreamingSources({
    episodeSlug: currentEpisode.slug,
  });

  let iframe = currentEpisode.videoUrl;

  if (!iframe) {
    iframe = await api.episodes.scrapeVideoUrl({ slug: currentEpisode.slug });

    if (!iframe) notFound();

    await api.episodes.updateVideoUrl({
      id: currentEpisode.id,
      videoUrl: iframe,
    });
  }

  return (
    <>
      <pre>{JSON.stringify(json, null, 2)}</pre>
      <iframe
        src={iframe}
        className="min-h-[260px] w-full bg-black md:aspect-video md:min-h-0"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      />
    </>
  );
};
