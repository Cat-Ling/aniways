import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { HeartCrack } from "lucide-react";

import { createAnimeService } from "@aniways/data";

import { AnimeGrid, AnimeGridLoader } from "../anime-grid";
import { Pagination, PaginationLoader } from "../pagination";

const searchAnime = cache(async (query: string, page: number) => {
  const service = createAnimeService();

  return service.searchAnime(query, page);
});

export const generateMetadata = ({
  searchParams: { query },
}: {
  searchParams: { query: string };
}): Metadata => {
  return {
    title: `${query} - Search`,
    description: `Search for ${query} on AniWays`,
  };
};

const SearchPage = ({
  searchParams: { query, ...searchParams },
}: {
  searchParams: { query: string; page: string };
}) => {
  const page = Number(searchParams.page || "1");

  return (
    <>
      <div className="mb-6 flex w-full flex-col justify-between gap-3 md:mb-5 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Search</h1>
          <p className="text-muted-foreground">
            Showing results for <span className="text-foreground">{query}</span>
          </p>
        </div>
        <Suspense key={query + "-pagination"} fallback={<PaginationLoader />}>
          <PaginationWrapper page={page} query={query} />
        </Suspense>
      </div>
      <Suspense key={query + page} fallback={<AnimeGridLoader />}>
        <SearchResults query={query} page={page} />
      </Suspense>
      <div className="-mb-6 mt-6">
        <Suspense key={query + "-pagination"} fallback={<PaginationLoader />}>
          <PaginationWrapper page={page} query={query} />
        </Suspense>
      </div>
    </>
  );
};

const SearchResults = async ({
  query,
  page,
}: {
  query: string;
  page: number;
}) => {
  const { animes } = await searchAnime(query, page);

  if (!animes.length) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 p-3">
        <HeartCrack className="text-primary" size={128} />
        <h2 className="text-3xl font-bold">Oops, no results found</h2>
        <p className="text-center text-muted-foreground">
          Sorry, we couldn't find any results matching your query.
        </p>
      </div>
    );
  }

  return <AnimeGrid animes={animes} type="search" />;
};

const PaginationWrapper = async (props: { page: number; query: string }) => {
  const { hasNext, animes } = await searchAnime(props.query, props.page);

  if (!animes.length) {
    return null;
  }

  return <Pagination hasNext={hasNext} />;
};

export default SearchPage;
