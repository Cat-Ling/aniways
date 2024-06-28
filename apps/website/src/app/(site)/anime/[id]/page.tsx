"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { Skeleton } from "@aniways/ui/skeleton";

import { api } from "~/trpc/react";

const AnimeRedirectPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data } = api.episodes.getFirstEpisodeByAnimeId.useQuery({
    id: typeof id === "string" ? id : id?.[0] ?? "",
  });

  useEffect(() => {
    if (!data) return;

    if (data.episode === undefined) {
      throw new Error("No episode found");
    }

    router.replace(
      `/anime/${typeof id === "string" ? id : id?.[0] ?? ""}/episodes/${data.episode}`
    );
  }, [data, router, id]);

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
