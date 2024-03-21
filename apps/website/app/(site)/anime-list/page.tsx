import { auth } from '@aniways/myanimelist';
import { cookies } from 'next/headers';
import { RedirectType, redirect } from 'next/navigation';
import { getAnimeList } from '@aniways/myanimelist';
import { Image } from '@ui/components/ui/aniways-image';
import Link from 'next/link';
import { Button } from '@ui/components/ui/button';
import { Skeleton } from '@ui/components/ui/skeleton';
import { Suspense } from 'react';

type AnimeListPageProps = {
  searchParams: { page?: string };
};

const AnimeListPage = async (props: AnimeListPageProps) => {
  const { page = '1' } = props.searchParams;

  const user = await auth(cookies());

  if (!user) {
    redirect('/', RedirectType.replace);
  }

  const {
    accessToken,
    user: { name },
  } = user;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl">
        <span className="font-bold">{name}'s</span> Anime List
      </h1>
      <Suspense key={page} fallback={<AnimeListLoader />}>
        <AnimeList
          page={Number(page)}
          accessToken={accessToken}
          username={name}
        />
      </Suspense>
    </div>
  );
};

type AnimeListProps = {
  page: number;
  accessToken: string;
  username: string;
};

const AnimeList = async ({ page, accessToken, username }: AnimeListProps) => {
  const animeList = await getAnimeList(accessToken, username, page);

  return (
    <>
      <div className="mb-3 flex w-full items-center justify-end gap-2">
        {animeList.paging.previous && (
          <Button asChild>
            <Link href={`/anime-list?page=${Number(page) - 1}`} rel="prev">
              Previous
            </Link>
          </Button>
        )}
        {page && <span className="text-muted-foreground">Page {page}</span>}
        {animeList.paging.next && (
          <Button asChild>
            <Link href={`/anime-list?page=${Number(page) + 1}`} rel="next">
              Next
            </Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {animeList.data.map(({ node: anime }) => (
          <div key={anime.id}>
            <div className="relative h-96 w-full overflow-hidden rounded-lg">
              <Skeleton className="absolute h-full w-full" />
              <Image
                className="absolute left-0 top-0 h-96 w-full rounded-lg object-cover"
                width={300}
                height={500}
                src={anime.main_picture.large}
                alt={anime.title}
              />
            </div>
            <div>{anime.title}</div>
            <div>{anime.media_type}</div>
          </div>
        ))}
      </div>
    </>
  );
};

const AnimeListLoader = () => {
  return (
    <>
      <Skeleton className="mb-3 mr-auto h-10 w-full" />
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
    </>
  );
};

export default AnimeListPage;
