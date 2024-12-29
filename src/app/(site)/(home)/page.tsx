import { AnimeGrid } from "@/components/layouts/anime-grid";
import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";
import { Pagination, PaginationLoader } from "@/components/pagination";
import { type RouterOutputs } from "@/trpc/react";
import { api } from "@/trpc/server";
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
        className="mb-6 flex w-full flex-col justify-between gap-3 md:mb-5 md:flex-row md:items-center md:gap-0"
      >
        <h1 className="text-lg font-bold md:text-2xl">Recently Released</h1>
        <Suspense fallback={<PaginationLoader />}>
          <PaginationWrapper result={recentlyReleased} />
        </Suspense>
      </div>
      <div className="mb-6">
        <Suspense key={page} fallback={<AnimeGridLoader featured />}>
          <RecentlyReleasedAnime result={recentlyReleased} />
        </Suspense>
      </div>
      <div className="mb-6 md:mb-0">
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
      <div className="mb-3">
        <AnimeGrid animes={animes.slice(0, 4)} type="featured" episodeInUrl />
      </div>
      <AnimeGrid animes={animes.slice(4)} episodeInUrl />
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
