import { Suspense } from 'react';
import { AnimeGridLoader } from '../anime-grid-loader';
import { AnimeGrid } from '../anime-grid';
import { searchAnime } from '@aniways/data-access';
import { Pagination } from '../pagination';
import { PaginationLoader } from '../pagination-loader';
import { unstable_cache } from 'next/cache';

const ONE_HOUR = 1000 * 60 * 60;

const cachedAnimeSearch = unstable_cache(
  async (query: string, page: number) => {
    // ensure we don't get rate limited on dev mode
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    if (process.env.NODE_ENV === 'development') {
      return {
        animes: [
          {
            name: 'Naruto',
            image: 'https://cdn.myanimelist.net/images/anime/1565/111305.jpg',
            url: '/anime/naruto',
            total: 220,
          },
        ],
        hasNext: false,
      };
    }
    return await searchAnime(query, page);
  },
  ['search'],
  {
    tags: ['search'],
    revalidate: ONE_HOUR,
  }
);

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
  const { animes } = await cachedAnimeSearch(query, page);

  return <AnimeGrid anime={animes} type="search" />;
};

const PaginationWrapper = async (props: { page: number; query: string }) => {
  const { hasNext } = await cachedAnimeSearch(props.query, props.page);

  return <Pagination hasNext={hasNext} />;
};

export default SearchPage;
