import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";
import { Pagination, PaginationLoader } from "@/components/pagination";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";
import { type RouterOutputs } from "@/trpc/react";
import { api } from "@/trpc/server";
import { Play } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type HomePageProps = {
  searchParams: Promise<{
    page: string;
  }>;
};

const HomePage = async ({ searchParams }: HomePageProps) => {
  const parsedSearchParams = await searchParams;
  const page = Number.isNaN(Number(parsedSearchParams.page))
    ? 1
    : Number(parsedSearchParams.page);

  const recentlyReleased = api.hiAnime.getRecentlyAdded({ page });

  return (
    <>
      <div
        id={"recently-released"}
        className="mb-6 flex w-full flex-col justify-between gap-3 pt-6 md:mb-5 md:flex-row md:items-center md:gap-0"
      >
        <h1 className="text-lg font-bold md:text-2xl">Recently Released</h1>
        <Suspense fallback={<PaginationLoader />}>
          <PaginationWrapper result={recentlyReleased} />
        </Suspense>
      </div>
      <div className="mb-12">
        <Suspense key={page} fallback={<AnimeGridLoader />}>
          <RecentlyReleasedAnime result={recentlyReleased} />
        </Suspense>
      </div>
      <div className="-my-6">
        <Suspense fallback={<PaginationLoader />}>
          <PaginationWrapper result={recentlyReleased} />
        </Suspense>
      </div>
    </>
  );
};

const RecentlyReleasedAnime = async ({
  result,
}: {
  result: Promise<RouterOutputs["hiAnime"]["getRecentlyAdded"]>;
}) => {
  const { animes } = await result;

  return (
    <>
      <ul className="mb-3 grid h-full grid-cols-2 gap-3 md:grid-cols-4">
        {animes.slice(0, 4).map((anime) => {
          return (
            <li
              key={anime.id}
              className="group rounded-md border border-border bg-background p-2"
            >
              <Link
                href={`/anime/${anime.id}/episodes/${anime.episode}`}
                className="flex h-full flex-col gap-3"
              >
                <div className="relative">
                  <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
                    <Skeleton className="absolute z-0 h-full w-full rounded-md" />
                    <Image
                      src={anime.image ?? ""}
                      alt={anime.title ?? ""}
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
                    {anime.title ?? "????"}
                  </p>
                  <p className="my-1 line-clamp-3 hidden text-xs text-muted-foreground md:block md:text-sm">
                    {anime.description}
                  </p>
                  <p className="mt-1 flex-1 text-xs text-muted-foreground md:text-sm">
                    Episode {anime.episode}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className="mb-3 grid h-full grid-cols-2 gap-3 md:grid-cols-6">
        {animes.slice(4).map((anime) => {
          return (
            <li
              key={anime.id}
              className="group rounded-md border border-border bg-background p-2"
            >
              <Link
                href={`/anime/${anime.id}/episodes/${anime.episode}`}
                className="flex h-full flex-col gap-3"
              >
                <div className="relative">
                  <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
                    <Skeleton className="absolute z-0 h-full w-full rounded-md" />
                    <Image
                      src={anime.image ?? ""}
                      alt={anime.title ?? ""}
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
                    {anime.title ?? "????"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                    Episode {anime.episode}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const PaginationWrapper = async ({
  result,
}: {
  result: Promise<RouterOutputs["hiAnime"]["getRecentlyAdded"]>;
}) => {
  const { hasNextPage, animes } = await result;

  if (!animes.length) return null;

  return <Pagination hasNext={hasNextPage} />;
};

export default HomePage;
