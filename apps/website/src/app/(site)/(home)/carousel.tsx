"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayIcon } from "lucide-react";

import type { CarouselApi } from "@aniways/ui/carousel";
import { Image } from "@aniways/ui/aniways-image";
import { Button } from "@aniways/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@aniways/ui/carousel";
import { Skeleton } from "@aniways/ui/skeleton";

import { api } from "~/trpc/react";

export const AnimeCarousel = () => {
  const seasonalAnimeQuery = api.myAnimeList.getCurrentSeasonAnimes.useQuery();

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    setCount(carouselApi.scrollSnapList().length);
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

  if (seasonalAnimeQuery.isLoading || !seasonalAnimeQuery.data) {
    return <Skeleton className="mb-2 h-[430px] md:mb-5" />;
  }

  return (
    <Carousel
      className="relative mb-12"
      setApi={setCarouselApi}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {seasonalAnimeQuery.data.map(anime => {
          const { anime: animeFromDB } = anime;

          const url =
            animeFromDB ?
              `/anime/${animeFromDB.id}`
            : "/search?query=" + anime.title;

          return (
            <CarouselItem key={anime.mal_id}>
              <div className="flex w-full flex-col-reverse gap-3 md:grid md:grid-cols-5 md:gap-6">
                <div className="col-span-2 flex select-none flex-col justify-center">
                  <h1 className="mb-2 text-2xl font-bold md:mb-5 md:text-5xl">
                    {anime.title}
                  </h1>
                  <div className="mb-3 flex gap-2">
                    <span className="rounded-md bg-muted p-2 text-sm text-primary">
                      {anime.rating}
                    </span>
                    <span className="rounded-md bg-muted p-2 text-sm text-primary">
                      {anime.type}
                    </span>
                    <span className="rounded-md bg-muted p-2 text-sm text-primary">
                      {anime.episodes ?? "???"} episodes
                    </span>
                  </div>
                  <p className="mb-2 line-clamp-3 text-sm text-muted-foreground md:mb-5">
                    {anime.synopsis}
                  </p>
                  <Button className="flex w-fit items-center gap-2" asChild>
                    <Link href={url}>
                      <PlayIcon className="h-5 w-5" />
                      Watch Now
                    </Link>
                  </Button>
                </div>
                <div className="relative col-span-3 aspect-video w-full overflow-hidden rounded-md p-3">
                  <div
                    className="absolute bottom-0 left-0 right-0 top-0 -m-3 h-full w-full bg-cover bg-center bg-no-repeat blur-sm"
                    style={{
                      backgroundImage: `url(${anime.images.webp.large_image_url})`,
                    }}
                  />
                  <div className="relative z-10 flex aspect-video h-full w-full items-center justify-center">
                    <Image
                      src={anime.images.webp.large_image_url}
                      alt={anime.title}
                      className="h-full rounded-lg object-contain shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="bottom-0 left-0 m-2 mt-6 flex w-full justify-center md:absolute md:m-2 md:w-fit">
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
