import { ContinueWatching as ContinueWatchingClient } from "@/components/anime/continue-watching";
import { PlanToWatch as PlanToWatchClient } from "@/components/anime/plan-to-watch";
import { TrendingAnime as TrendingAnimeClient } from "@/components/anime/trending-anime";
import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/server";
import { Suspense, type ReactNode } from "react";
import {
  SeasonalAnimeCarousel,
  SeasonalAnimeCarouselLoader,
} from "@/components/anime/carousel";
import { GenreMenu } from "@/components/anime/genre-menu";
import { Image } from "@/components/ui/image";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";
import Link from "next/link";

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  const topAnime = api.hiAnime.getTopAnime();
  const genre = api.hiAnime.getGenres();
  return (
    <>
      <Suspense fallback={<SeasonalAnimeCarouselLoader />}>
        <SeasonalAnimeCarousel />
      </Suspense>
      <Suspense
        fallback={
          <>
            <Skeleton className="mb-2 h-7 w-60 font-bold md:mb-5 md:h-8" />
            <div className="mb-6">
              <AnimeGridLoader length={6} />
            </div>
          </>
        }
      >
        <TrendingAnime />
      </Suspense>
      <Suspense
        fallback={
          <>
            <Skeleton className="mb-2 h-7 w-60 font-bold md:mb-5 md:h-8" />
            <div className="mb-6">
              <AnimeGridLoader length={6} />
            </div>
          </>
        }
      >
        <ContinueWatching />
      </Suspense>
      <Suspense
        fallback={
          <>
            <Skeleton className="mb-2 h-7 w-60 font-bold md:mb-5 md:h-8" />
            <div className="mb-6">
              <AnimeGridLoader length={6} />
            </div>
          </>
        }
      >
        <PlanToWatch />
      </Suspense>
      <div className="w-full md:grid md:grid-cols-4">
        <section className="col-span-3">{children}</section>
        <section className="flex flex-col justify-start gap-6 pl-2 md:flex-col-reverse md:justify-end">
          <Suspense
            fallback={<Skeleton className="h-[1000px] w-full rounded-md" />}
          >
            <TopAnime result={topAnime} />
          </Suspense>
          <Suspense
            fallback={<Skeleton className="h-[500px] w-full rounded-md" />}
          >
            <Genres result={genre} />
          </Suspense>
        </section>
      </div>
    </>
  );
};

const TrendingAnime = async () => {
  const trendingAnime = await api.hiAnime.getTrendingAnime();

  return <TrendingAnimeClient trendingAnime={trendingAnime} />;
};

const ContinueWatching = async () => {
  const initalData = await api.mal
    .getContinueWatching({ page: 1 })
    .catch(() => null);

  if (!initalData) return null;

  return <ContinueWatchingClient initialData={initalData} />;
};

const PlanToWatch = async () => {
  const initalData = await api.mal
    .getPlanToWatch({ page: 1 })
    .catch(() => null);

  if (!initalData) return null;

  return <PlanToWatchClient initialData={initalData} />;
};

const TopAnime = async ({
  result,
}: {
  result: Promise<RouterOutputs["hiAnime"]["getTopAnime"]>;
}) => {
  const topAnime = await result;

  return (
    <Tabs defaultValue="today">
      <div className="flex w-full flex-col gap-3">
        <h1 className="text-lg font-bold md:text-2xl">Top 10 Anime</h1>
        <TabsList className="grid w-full grid-cols-3 gap-1 bg-background">
          <TabsTrigger
            value="today"
            className="hover:bg-muted data-[state=active]:bg-primary data-[state=active]:hover:bg-primary"
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value="week"
            className="hover:bg-muted data-[state=active]:bg-primary data-[state=active]:hover:bg-primary"
          >
            Week
          </TabsTrigger>
          <TabsTrigger
            value="month"
            className="hover:bg-muted data-[state=active]:bg-primary data-[state=active]:hover:bg-primary"
          >
            Month
          </TabsTrigger>
        </TabsList>
      </div>
      {(["today", "week", "month"] as const).map((value) => (
        <TabsContent
          key={value}
          value={value}
          className={
            'flex-col gap-3 rounded-md p-3 data-[state="active"]:flex data-[state="active"]:bg-muted'
          }
        >
          {topAnime[value].map((anime, index) => (
            <Link
              key={anime.id}
              className="group flex items-center gap-1 transition"
              href={`/anime/${anime.id}`}
            >
              <div className="-mt-3 w-8 text-lg font-bold text-muted-foreground transition group-hover:text-foreground">
                {`0${index + 1}`.slice(-2)}
              </div>
              <div className="w-full">
                <div className="grid w-full grid-cols-5 items-center gap-3">
                  <Image
                    src={anime.poster!}
                    alt={anime.jname ?? ""}
                    className="col-span-1 aspect-[450/650] w-full overflow-hidden rounded-md"
                  />
                  <div className="col-span-4 flex flex-col justify-between">
                    <p className="line-clamp-2 text-xs transition group-hover:text-primary md:text-sm">
                      {anime.jname ?? "????"}
                    </p>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      {anime.episodes.sub} episodes
                    </p>
                  </div>
                </div>
                <div
                  role="separator"
                  className={cn(
                    "mt-3 border-b border-muted-foreground/20",
                    index === topAnime[value].length - 1 && "hidden",
                  )}
                />
              </div>
            </Link>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};

const Genres = async ({
  result,
}: {
  result: Promise<RouterOutputs["hiAnime"]["getGenres"]>;
}) => {
  const genres = await result;

  return <GenreMenu genres={genres} />;
};

export default HomeLayout;
