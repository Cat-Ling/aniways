import { Suspense } from 'react';
import { AnimeGridLoader } from '../anime-grid-loader';
import { AnimeGrid } from '../anime-grid';
import { getAnimeFromAllAnime } from '@/data-access/anime';
import { Pagination } from '../pagination';
import { PaginationLoader } from '../pagination-loader';

const SearchPage = async ({
  searchParams: { query, ...searchParams },
}: {
  searchParams: { query: string; page: string };
}) => {
  const page = Number(searchParams.page || '1');

  return (
    <>
      <div className="mb-5 flex w-full items-center justify-between">
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
  const { anime } = await getAnimeFromAllAnime(page, query);

  return <AnimeGrid anime={anime} />;
};

const PaginationWrapper = async (props: { page: number; query: string }) => {
  const { next } = await getAnimeFromAllAnime(props.page, props.query);

  return <Pagination hasNext={!!next} />;
};

export default SearchPage;
