"use client";

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
    <>
      <div className="mb-3">
        <Skeleton className="mb-2 h-7 w-96" />
        <Skeleton className="h-6 w-64" />
      </div>
      <div className="mb-5 flex aspect-video w-full flex-col gap-2">
        <div className="flex-1">
          <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
        </div>
        <Skeleton className="mb-6 mt-3 h-10 w-full" />
        <h2 className="mb-3 text-lg font-semibold">Episodes</h2>
        <Skeleton className="mb-6 h-10 w-full" />
      </div>
    </>
  );
};

export default AnimeRedirectPage;
