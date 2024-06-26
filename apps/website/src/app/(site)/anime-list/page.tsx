import { cache, Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { Play, Shell } from "lucide-react";

import { auth } from "@aniways/auth";
import { Image } from "@aniways/ui/aniways-image";
import { Skeleton } from "@aniways/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@aniways/ui/tabs";

import { api } from "~/trpc/server";
import { Pagination, PaginationLoader } from "../pagination";

type Status =
  | "all"
  | "watching"
  | "completed"
  | "on_hold"
  | "dropped"
  | "plan_to_watch";

type ReadableStatus =
  | "All"
  | "Watching"
  | "Completed"
  | "On Hold"
  | "Dropped"
  | "Plan to Watch";

const statusMap: Record<Status, ReadableStatus> = {
  all: "All",
  watching: "Watching",
  completed: "Completed",
  on_hold: "On Hold",
  dropped: "Dropped",
  plan_to_watch: "Plan to Watch",
};

interface AnimeListPageProps {
  searchParams: { page?: string; status?: Status };
}

const AnimeListPage = async ({
  searchParams: { status = "all", ...searchParams },
}: AnimeListPageProps) => {
  const page = Math.max(Number(searchParams.page ?? 1), 1);

  const session = await auth(cookies());

  if (!session?.user) {
    redirect("/", RedirectType.replace);
  }

  const { user } = session;

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue={status}>
        <div className="flex w-full flex-col gap-6 md:mb-3">
          <h1 className="text-2xl">
            <span className="font-bold">{user.name}'s</span> Anime List
          </h1>
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <TabsList className="flex h-fit max-w-full flex-wrap">
              {Object.entries(statusMap).map(([key, value]) => (
                <TabsTrigger key={key} value={key} asChild>
                  <Link href={`?status=${key}`}>{value}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
            <Suspense key={status} fallback={<PaginationLoader />}>
              <PaginationWrapper page={page} status={status} />
            </Suspense>
          </div>
        </div>
      </Tabs>
      <Suspense key={page + status} fallback={<AnimeListLoader />}>
        <AnimeList page={page} status={status} />
      </Suspense>
      <div className="-mb-6">
        <Suspense key={status} fallback={<PaginationLoader />}>
          <PaginationWrapper page={page} status={status} />
        </Suspense>
      </div>
    </div>
  );
};

interface AnimeListProps {
  page: number;
  status: Status;
}

const getAnimeListOfUser = cache(async (page: number, status: Status) => {
  return await api.myAnimeList.getAnimeListOfUser({
    page,
    status,
  });
});

const PaginationWrapper = async ({ page, status }: AnimeListProps) => {
  const animeList = await getAnimeListOfUser(page, status);

  if (!animeList.anime.length) return null;

  return <Pagination hasNext={animeList.hasNext} />;
};

const AnimeList = async ({ page, status }: AnimeListProps) => {
  const animeList = await getAnimeListOfUser(page, status);

  if (!animeList.anime.length) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 p-3">
        <Shell className="text-primary" size={128} />
        <h2 className="text-3xl font-bold">No Anime {statusMap[status]}</h2>
        <p className="text-center text-muted-foreground">
          There are no anime in your list with the status{" "}
          <span className="text-foreground">{statusMap[status]}</span>. Try
          changing the status or adding some anime to your list.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid h-full grid-cols-2 gap-3 md:grid-cols-5">
      {animeList.anime.map(anime => {
        const animeFromDB = anime.dbAnime;

        const url =
          animeFromDB ?
            `/anime/${animeFromDB.id}`
          : `/search?query=${anime.title}`;

        return (
          <li
            key={anime.id}
            className="group rounded-md border border-border bg-background p-2"
          >
            <Link href={url} className="flex h-full flex-col gap-3">
              <div className="relative">
                <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
                  <Skeleton className="absolute z-0 h-full w-full rounded-md" />
                  <Image
                    src={anime.main_picture.large}
                    alt={anime.title}
                    width={450}
                    height={650}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-muted/70 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                  <Play className="h-8 w-8 text-primary" />
                  <p className="mt-2 text-lg font-bold text-foreground">
                    Watch Now
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <p className="line-clamp-2 text-xs transition group-hover:text-primary md:text-sm">
                  {anime.title}
                </p>
                <div className="flex w-full justify-between">
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                    {statusMap[anime.my_list_status?.status ?? "plan_to_watch"]}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                    {anime.my_list_status?.num_episodes_watched ?? 0} of{" "}
                    {anime.num_episodes || "???"}ep
                  </p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

const AnimeListLoader = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array(20)
        .fill(null)
        .map((_, index) => (
          <div key={index}>
            <div className="relative h-96 w-full overflow-hidden rounded-lg">
              <Skeleton className="absolute h-full w-full" />
            </div>
            <Skeleton className="w-3/4" />
          </div>
        ))}
    </div>
  );
};

export default AnimeListPage;
