import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { EpisodesSection } from "~/components/anime/episodes";
import { AnimeMetadata } from "~/components/anime/metadata";
import { getAnimeById, getEpisodesOfAnime } from "./cache";

interface AnimeStreamingLayoutProps {
  children: ReactNode;
  params: {
    id: string;
    episode: string;
  };
}

const AnimeStreamingLayout = async ({
  children,
  params: { id, episode },
}: AnimeStreamingLayoutProps) => {
  episode = episode.replace("-", ".");

  const anime = await getAnimeById({ id });

  if (!anime) notFound();

  const episodes = await getEpisodesOfAnime({ animeId: id });

  return (
    <>
      {children}
      <div className="mb-5">
        <EpisodesSection
          animeId={id}
          currentEpisode={episode}
          episodes={episodes}
        />
      </div>
      <AnimeMetadata anime={anime} />
    </>
  );
};

export default AnimeStreamingLayout;
