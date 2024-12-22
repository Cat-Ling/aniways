import { type ReactNode } from "react";
import { notFound } from "next/navigation";

import { EpisodesSection } from "@/components/anime/episodes";
import { AnimeMetadata } from "@/components/anime/metadata";
import { api } from "@/trpc/server";

interface AnimeStreamingLayoutProps {
  children: ReactNode;
  params: Promise<{
    id: string;
  }>;
}

const AnimeStreamingLayout = async ({
  children,
  params,
}: AnimeStreamingLayoutProps) => {
  const { id } = await params;

  const [anime, episodes] = await Promise.all([
    api.hiAnime.getInfo({ id }),
    api.hiAnime.getEpisodes({ id }),
  ]);

  const malId = anime?.anime.info.malId;

  if (!malId) notFound();

  return (
    <>
      {children}
      <div className="mb-5">
        <EpisodesSection animeId={id} episodes={episodes} />
      </div>
      <AnimeMetadata malId={malId} />
    </>
  );
};

export default AnimeStreamingLayout;
