"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { Skeleton } from "@aniways/ui/skeleton";

import { api } from "~/trpc/react";

const AnimeRedirectPage = () => {
  const params = useParams();
  const router = useRouter();

  const id = useMemo(() => {
    if (typeof params.id === "string") {
      return params.id;
    }

    return params.id?.[0] ?? "";
  }, [params.id]);

  const firstEpisodeQuery = api.episodes.getFirstEpisodeByAnimeId.useQuery({
    id,
  });

  const seedMissingEpisodes = api.episodes.seedMissingEpisodes.useMutation({
    onSuccess: episode => {
      router.replace(`/anime/${id}/episodes/${episode ?? "1"}`);
    },
    onError: () => {
      router.replace("/404");
    },
  });

  useEffect(() => {
    if (!firstEpisodeQuery.data) return;

    if (firstEpisodeQuery.data.episode) {
      return router.replace(
        `/anime/${id}/episodes/${firstEpisodeQuery.data.episode}`
      );
    }

    if (seedMissingEpisodes.status === "idle") {
      return seedMissingEpisodes.mutate({ id });
    }

    if (seedMissingEpisodes.status === "pending") {
      return;
    }

    return router.replace("/404");
  }, [router, firstEpisodeQuery, id, seedMissingEpisodes]);

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
