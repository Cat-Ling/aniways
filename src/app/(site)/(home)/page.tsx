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
      <AnimeGrid className="mb-3 md:grid-cols-4">
        {animes.slice(0, 4).map((anime) => (
          <AnimeGrid.Item
            key={anime.id}
            title={anime.jname ?? anime.name ?? "???"}
            subtitle={`Episode ${anime.episodes ?? "???"}`}
            poster={anime.poster ?? ""}
            url={`/anime/${anime.id}?episode=${anime.episodes}`}
          />
        ))}
      </AnimeGrid>
      <AnimeGrid>
        {animes.slice(4).map((anime) => (
          <AnimeGrid.Item
            key={anime.id}
            title={anime.jname ?? anime.name ?? "???"}
            subtitle={`Episode ${anime.episodes ?? "???"}`}
            poster={anime.poster ?? ""}
            url={`/anime/${anime.id}?episode=${anime.episodes}`}
          />
        ))}
      </AnimeGrid>
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
