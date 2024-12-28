import { MalScraper } from "@/server/myanimelist";
import { unstable_cacheLife } from "next/cache";
import { SeasonalAnimeCarouselClient } from "./seasonal-anime-carousel-client";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Not using trpc and directly calling scraper class
 * cos of cache and cookie issues which trpc gives
 */
export const SeasonalAnimeCarousel = async () => {
  "use cache";

  unstable_cacheLife("days");

  const data = await new MalScraper().getCurrentSeason();

  return <SeasonalAnimeCarouselClient seasonalAnime={data.slice(0, 10)} />;
};

export const SeasonalAnimeCarouselLoader = () => {
  return (
    <div className="mb-6 flex w-full flex-col-reverse gap-3 md:grid md:grid-cols-5 md:gap-6">
      <div className="col-span-2 hidden select-none flex-col justify-center md:flex">
        <Skeleton className="mb-2 line-clamp-3 h-6 w-1/2 text-2xl font-bold md:mb-5 md:h-12 md:text-5xl" />
        <Skeleton className="mb-3 flex h-10 w-3/4 gap-2" />
        <Skeleton className="mb-2 line-clamp-3 h-16 w-full text-sm text-muted-foreground md:mb-5" />
        <Skeleton className="flex h-10 w-36 items-center gap-2" />
      </div>
      <Skeleton className="relative col-span-3 aspect-video w-full overflow-hidden rounded-md p-3" />
    </div>
  );
};
