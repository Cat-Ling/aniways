"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PlayIcon } from "lucide-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

interface SeasonalAnimeCarouselClientProps {
  seasonalAnime: {
    animeId: string;
    title: string;
    rating?: string | null;
    type?: string | null;
    episodes?: number | null;
    synopsis?: string | null;
    bannerImage: string | null;
    backUpImage?: string | null;
  }[];
  lastUpdated: Date;
}

export const SeasonalAnimeCarouselClient = (
  props: SeasonalAnimeCarouselClientProps,
) => {
  const { carouselApi, setCarouselApi, count, current } = useCarouselApi();
  // prettier-ignore
  const { mutate: saveSeasonalSpotlightAnime, status } = api.mal.saveSeasonalSpotlightAnime.useMutation();

  useEffect(() => {
    // If the last update was less than a week ago, don't update
    if (props.lastUpdated.getTime() + 1000 * 60 * 60 * 24 * 7 > Date.now()) {
      return;
    }

    if (status === "pending") return;
    saveSeasonalSpotlightAnime();
  }, [props.lastUpdated, saveSeasonalSpotlightAnime, status]);

  return (
    <Carousel
      className="relative md:mb-12"
      setApi={setCarouselApi}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {props.seasonalAnime.map((anime) => {
          return (
            <CarouselItem key={anime.animeId}>
              <div className="relative flex w-full flex-col-reverse gap-3 md:static md:grid md:grid-cols-5 md:gap-6">
                <div className="absolute bottom-0 left-0 z-20 col-span-2 flex w-full select-none flex-col justify-center p-3 md:static md:z-0">
                  <h1 className="mb-2 line-clamp-1 text-xl font-bold md:mb-5 md:line-clamp-3 md:text-5xl">
                    {anime.title}
                  </h1>
                  <div className="mb-3 hidden gap-2 md:flex">
                    {[
                      anime.rating,
                      anime.type,
                      `${anime.episodes ?? "???"} episodes`,
                    ]
                      .filter((data) => data)
                      .map((data, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-muted p-2 text-sm text-primary"
                        >
                          {data}
                        </span>
                      ))}
                  </div>
                  <p
                    className={cn(
                      "mb-2 line-clamp-3 hidden text-sm text-muted-foreground md:mb-5 md:[display:-webkit-box]",
                      {
                        italic: !anime.synopsis,
                      },
                    )}
                  >
                    {anime.synopsis ?? "No description available"}
                  </p>
                  <Button className="flex w-fit items-center gap-2" asChild>
                    <Link href={`/anime/${anime.animeId}`}>
                      <PlayIcon className="h-5 w-5" />
                      Watch Now
                    </Link>
                  </Button>
                </div>
                <div className="relative col-span-3 aspect-video w-full overflow-hidden rounded-md">
                  <div className="absolute left-0 top-0 z-10 h-full w-full bg-gradient-to-t from-primary/50 to-transparent md:bg-none"></div>
                  <Image
                    src={
                      anime.bannerImage?.length
                        ? anime.bannerImage
                        : (anime.backUpImage ?? "")
                    }
                    alt={anime.title}
                    className="h-full w-full rounded-lg object-cover object-center shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = anime.backUpImage ?? "";
                    }}
                  />
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="bottom-0 left-0 m-3 flex w-full justify-center md:absolute md:m-2 md:w-fit">
        {Array.from({ length: count }).map((_, i) => (
          <Button
            key={i}
            onClick={() => carouselApi?.scrollTo(i)}
            className={`mx-1 h-2 w-2 rounded-full p-0`}
            variant={i === current - 1 ? "default" : "secondary"}
          />
        ))}
      </div>
    </Carousel>
  );
};

const useCarouselApi = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const count = useMemo(
    () => carouselApi?.scrollSnapList().length ?? 0,
    [carouselApi],
  );

  useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    };

    carouselApi.on("select", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [carouselApi, current]);

  return { carouselApi, setCarouselApi, current, count };
};
