import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";

import { EpisodesSection as EpisodesSectionClient } from "@/components/anime/episodes";
import { AnimeMetadata as AnimeMetadataClient } from "@/components/anime/metadata";
import { api } from "@/trpc/server";
import { type RouterOutputs } from "@/trpc/react";
import { AnimeMetadataLoader } from "@/components/anime/metadata/anime-metadata-details";
import { Skeleton } from "@/components/ui/skeleton";

interface AnimeStreamingLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

const AnimeStreamingLayout = async ({
  children,
  params,
}: AnimeStreamingLayoutProps) => {
  const { id } = await params;

  const episodes = api.hiAnime.getEpisodes({ id });
  const anime = api.hiAnime.getSyncData({ id });

  return (
    <>
      {children}
      <Suspense fallback={<LayoutLoader />}>
        <EpisodesSection animeId={id} episodes={episodes} />
        <AnimeMetadata anime={anime} />
      </Suspense>
    </>
  );
};

type EpisodesSectionProps = {
  animeId: string;
  episodes: Promise<RouterOutputs["hiAnime"]["getEpisodes"]>;
};

const EpisodesSection = async ({ animeId, episodes }: EpisodesSectionProps) => {
  return (
    <div className="mb-5">
      <EpisodesSectionClient animeId={animeId} episodes={await episodes} />
    </div>
  );
};

type AnimeMetadataProps = {
  anime: Promise<RouterOutputs["hiAnime"]["getSyncData"]>;
};

const AnimeMetadata = async (props: AnimeMetadataProps) => {
  const { malId } = await props.anime.catch(() => notFound());

  if (!malId) notFound();

  const initialData = await api.mal.getAnimeInfo({ malId });

  return <AnimeMetadataClient malId={malId} initialData={initialData} />;
};

const LayoutLoader = () => {
  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-28" />
      </div>
      <h2 className="mb-3 text-lg font-semibold">Episodes</h2>
      <div className="grid h-fit max-h-[500px] w-full grid-cols-3 gap-2 overflow-scroll rounded-md sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
      <AnimeMetadataLoader />
    </>
  );
};

export default AnimeStreamingLayout;
