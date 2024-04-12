import { retreiveAnimeByQuery } from '@aniways/database';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { AnimeGrid, AnimeGridLoader } from '../anime-grid';
import { Pagination, PaginationLoader } from '../pagination';

export const generateMetadata = async ({
  searchParams: { query },
}: {
  searchParams: { query: string };
}): Promise<Metadata> => {
  return {
    title: `${query} - Search`,
    description: `Search for ${query} on AniWays`,
  };
};

const SearchPage = async ({
  searchParams: { query, ...searchParams },
}: {
  searchParams: { query: string; page: string };
}) => {
  const page = Number(searchParams.page || '1');

  return (
    <>
      <div className="mb-2 flex w-full flex-col justify-between gap-2 md:mb-5 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Search</h1>
          <p className="text-muted-foreground">
            Showing results for <span className="text-foreground">{query}</span>
          </p>
        </div>
        <Suspense fallback={<PaginationLoader />}>
          <PaginationWrapper page={page} query={query} />
        </Suspense>
      </div>
      <Suspense key={query + page} fallback={<AnimeGridLoader />}>
        <SearchResults query={query} page={page} />
      </Suspense>
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
  const { animes } = await retreiveAnimeByQuery(query, page);

  return <AnimeGrid animes={animes} type="search" />;
};

const PaginationWrapper = async (props: { page: number; query: string }) => {
  const { hasNext } = await retreiveAnimeByQuery(props.query, props.page);

  return <Pagination hasNext={hasNext} />;
};

export default SearchPage;
