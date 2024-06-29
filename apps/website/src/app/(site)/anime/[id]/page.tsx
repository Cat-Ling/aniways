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

  const { data } = api.episodes.getFirstEpisodeByAnimeId.useQuery({ id });

  const { data: anime, isLoading } = api.anime.byId.useQuery({ id });

  const utils = api.useUtils();

  const { mutate } = api.anime.seedMissingEpisodes.useMutation({
    onSuccess: () => {
      void utils.episodes.getFirstEpisodeByAnimeId.invalidate({ id });
    },
    onError: () => {
      router.replace("/404");
    },
  });

  useEffect(() => {
    if (!data) return;

    if (data.episode === undefined) {
      if (isLoading) return;
      if (!anime) return router.replace("/404");
      mutate({ slug: anime.slug });
    }

    router.replace(`/anime/${id}/episodes/${data.episode}`);
  }, [data, anime, router, id, mutate, isLoading]);

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
