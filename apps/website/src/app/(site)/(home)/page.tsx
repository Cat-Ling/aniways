import { cache, Suspense } from "react";

import { api } from "~/trpc/server";
import { AnimeGrid, AnimeGridLoader } from "../anime-grid";
import { Pagination, PaginationLoader } from "../pagination";

const getRecentlyReleasedAnimes = cache(async (page: number) => {
  return api.anime.recentlyReleased({ page });
});

const Home = ({ searchParams }: { searchParams: { page: string } }) => {
  const page = Math.max(Number(searchParams.page || "1"), 1);

  return (
    <>
      <div
        id={"recently-released"}
        className="mb-6 flex w-full flex-col justify-between gap-3 pt-6 md:mb-5 md:flex-row md:items-center md:gap-0"
      >
        <h1 className="text-lg font-bold md:text-2xl">Recently Released</h1>
        <Suspense fallback={<PaginationLoader />}>
          <PaginationWrapper page={page} />
        </Suspense>
      </div>
      <div className="mb-12">
        <Suspense key={page} fallback={<AnimeGridLoader />}>
          <RecentlyReleasedAnimeGrid page={page} />
        </Suspense>
      </div>
      <div className="-my-6">
        <Suspense fallback={<PaginationLoader />}>
          <PaginationWrapper page={page} />
        </Suspense>
      </div>
    </>
  );
};

const RecentlyReleasedAnimeGrid = async ({ page }: { page: number }) => {
  const { recentlyReleased } = await getRecentlyReleasedAnimes(page);

  return <AnimeGrid animes={recentlyReleased} type="home" />;
};

const PaginationWrapper = async ({ page }: { page: number }) => {
  const { hasNext } = await getRecentlyReleasedAnimes(page);

  return <Pagination hasNext={hasNext} />;
};

export default Home;
