"use client";

import { AnimeMetadataLoader } from "@/components/anime/metadata/anime-metadata-details";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const AnimeRedirectPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, isError } = api.hiAnime.getEpisodes.useQuery(
    { id: id as string },
    { enabled: !!id },
  );

  useEffect(() => {
    if (isLoading) return;

    if (isError) {
      router.replace("/404");
      return;
    }

    const firstEpisode = data?.episodes[0];

    if (!firstEpisode) {
      router.replace("/404");
      return;
    }

    router.replace(`/anime/${id as string}/episodes/${firstEpisode.number}`);
  }, [isError, isLoading, data, router, id]);

  return (
    <div className="mb-5 flex aspect-video w-full flex-col gap-2">
      <div className="flex-1">
        <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
      </div>
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
    </div>
  );
};

export default AnimeRedirectPage;
