import { Play } from 'lucide-react';
import { Pagination } from './pagination';
import { Suspense } from 'react';
import { getRecentlyReleasedFromAllAnime } from '@/data-access/anime';
import { Skeleton } from '@/components/ui/skeleton';

const Home = async ({ searchParams }: { searchParams: { page: string } }) => {
  const page = Number(searchParams.page || '1');

  return (
    <div className="container mx-auto p-6">
      <div className="w-full flex justify-between mb-5 items-center">
        <h1 className="text-2xl font-bold">Recently Released</h1>
        <Pagination />
      </div>
      <Suspense key={page} fallback={<RecentlyReleasedAnimeGridLoader />}>
        <RecentlyReleasedAnimeGrid page={page} />
      </Suspense>
    </div>
  );
};

const RecentlyReleasedAnimeGridLoader = () => {
  return (
    <ul className="grid grid-cols-6 gap-3 h-full">
      {Array.from({ length: 24 }).map((_, i) => (
        <Skeleton key={i} className="h-[380px]" />
      ))}
    </ul>
  );
};

const RecentlyReleasedAnimeGrid = async ({ page }: { page: number }) => {
  let recentlyReleased = await getRecentlyReleasedFromAllAnime(page);

  return (
    <ul className="grid grid-cols-6 gap-3 h-full">
      {recentlyReleased.map(({ name, image, episode, url }, i) => (
        <li
          key={i}
          className="bg-background border rounded-md border-border p-2 group"
        >
          <a
            href={`https://anitaku.to/${url}`}
            className="h-full flex flex-col gap-3"
          >
            <div className="relative">
              <div
                className="w-full aspect-[450/650] bg-cover rounded-md"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />
              <div className="absolute left-0 top-0 w-full h-full bg-muted/70 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition flex items-center justify-center flex-col">
                <Play className="w-8 h-8 text-primary" />
                <p className="text-foreground mt-2 text-lg font-bold">
                  Watch Now
                </p>
              </div>
            </div>
            <div className="flex justify-between flex-col flex-1">
              <p className="text-sm line-clamp-2 group-hover:text-primary transition">
                {name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Episode {episode}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Home;
