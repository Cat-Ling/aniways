import { auth } from '@aniways/myanimelist';
import { cookies } from 'next/headers';
import { RedirectType, redirect } from 'next/navigation';
import { getAnimeList } from '@aniways/myanimelist';
import { Image } from '@ui/components/ui/aniways-image';
import { Skeleton } from '@ui/components/ui/skeleton';
import { Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@ui/components/ui/tabs';
import { Pagination, PaginationLoader } from '../pagination';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { db, orm, schema } from '@aniways/database';

type Status =
  | 'all'
  | 'watching'
  | 'completed'
  | 'on_hold'
  | 'dropped'
  | 'plan_to_watch';

type AnimeListPageProps = {
  searchParams: { page?: string; status?: Status };
};

const AnimeListPage = async (props: AnimeListPageProps) => {
  const { page = '1', status = 'all' } = props.searchParams;

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
      <Tabs defaultValue={status}>
        <div className="mb-6 flex w-full flex-col gap-3">
          <h1 className="text-2xl">
            <span className="font-bold">{name}'s</span> Anime List
          </h1>
          <div className="flex w-full justify-between">
            <TabsList>
              <TabsTrigger value="all" asChild>
                <Link href="?status=all">All</Link>
              </TabsTrigger>
              <TabsTrigger value="watching" asChild>
                <Link href="?status=watching">Watching</Link>
              </TabsTrigger>
              <TabsTrigger value="completed" asChild>
                <Link href="?status=completed">Completed</Link>
              </TabsTrigger>
              <TabsTrigger value="on_hold" asChild>
                <Link href="?status=on_hold">On Hold</Link>
              </TabsTrigger>
              <TabsTrigger value="dropped" asChild>
                <Link href="?status=dropped">Dropped</Link>
              </TabsTrigger>
              <TabsTrigger value="plan_to_watch" asChild>
                <Link href="?status=plan_to_watch">Plan to Watch</Link>
              </TabsTrigger>
            </TabsList>
            <Suspense
              key={page + status + 'pagination'}
              fallback={<PaginationLoader />}
            >
              <PaginationWrapper
                page={Number(page)}
                accessToken={accessToken}
                username={name}
                status={status}
              />
            </Suspense>
          </div>
        </div>
      </Tabs>
      <Suspense key={page + status} fallback={<AnimeListLoader />}>
        <AnimeList
          page={Number(page)}
          accessToken={accessToken}
          username={name}
          status={status}
        />
      </Suspense>
    </div>
  );
};

type AnimeListProps = {
  page: number;
  accessToken: string;
  username: string;
  status: Status;
};

const StatusMap = {
  all: 'All',
  watching: 'Watching',
  completed: 'Completed',
  on_hold: 'On Hold',
  dropped: 'Dropped',
  plan_to_watch: 'Plan to Watch',
};

const PaginationWrapper = async ({
  page,
  accessToken,
  username,
  status,
}: AnimeListProps) => {
  const animeList = await getAnimeList(
    accessToken,
    username,
    page,
    20,
    status !== 'all' ? status : undefined
  );

  return <Pagination hasNext={!!animeList.paging.next} />;
};

const AnimeList = async ({
  page,
  accessToken,
  username,
  status,
}: AnimeListProps) => {
  const animeList = await getAnimeList(
    accessToken,
    username,
    page,
    20,
    status !== 'all' ? status : undefined
  );

  if (!animeList.data.length) return <p>No anime found</p>;

  const dbAnimes = await db
    .select()
    .from(schema.anime)
    .where(
      orm.inArray(
        schema.anime.malAnimeId,
        animeList.data.map(({ node: anime }) => anime.id)
      )
    );

  const animeMap = dbAnimes.reduce(
    (acc, anime) => {
      if (!anime.malAnimeId) return acc;
      acc[anime.malAnimeId] = anime;
      return acc;
    },
    {} as Record<number, schema.Anime>
  );

  return (
    <ul className="grid h-full grid-cols-2 gap-3 md:grid-cols-5">
      {animeList.data.map(({ node: anime }) => {
        const animeFromDB = animeMap[anime.id];

        const url =
          animeFromDB ?
            `/anime/${animeFromDB.id}`
          : `/search?query=${anime.title}`;

        return (
          <li
            key={anime.id}
            className="bg-background border-border group rounded-md border p-2"
          >
            <Link href={url} className="flex h-full flex-col gap-3">
              <div className="relative">
                <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
                  <Skeleton className="absolute z-0 h-full w-full rounded-md" />
                  <Image
                    src={anime.main_picture.large}
                    alt={anime.title}
                    width={450}
                    height={650}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="bg-muted/70 pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                  <Play className="text-primary h-8 w-8" />
                  <p className="text-foreground mt-2 text-lg font-bold">
                    Watch Now
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <p className="group-hover:text-primary line-clamp-2 text-xs transition md:text-sm">
                  {anime.title}
                </p>
                <div className="flex w-full justify-between">
                  <p className="text-muted-foreground mt-1 text-xs md:text-sm">
                    {StatusMap[anime.my_list_status?.status ?? 'plan_to_watch']}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs md:text-sm">
                    {anime.my_list_status?.num_episodes_watched ?? 0} of{' '}
                    {anime.num_episodes ?? '???'}ep
                  </p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
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
