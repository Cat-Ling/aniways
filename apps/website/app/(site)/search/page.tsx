import { Suspense } from 'react';
import { AnimeGridLoader } from '../anime-grid-loader';
import { AnimeGrid } from '../anime-grid';
import { searchFromDB } from '@aniways/data-access';
import { Pagination } from '../pagination';
import { PaginationLoader } from '../pagination-loader';
import { Metadata } from 'next';

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
        <Suspense
          key={query + page + '-pagination'}
          fallback={<PaginationLoader />}
        >
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
  const { animes } = await searchFromDB(query, page);

  return <AnimeGrid animes={animes} type="search" />;
};

const PaginationWrapper = async (props: { page: number; query: string }) => {
  const { hasNext } = await searchFromDB(props.query, props.page);

  return <Pagination hasNext={hasNext} />;
};

export default SearchPage;
