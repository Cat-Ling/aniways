"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PlayIcon } from "lucide-react";
import { type RouterOutputs } from "@/trpc/react";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import { Image } from "../ui/image";

interface AnimeCarouselProps {
  seasonalAnime: RouterOutputs["mal"]["getCurrentSeasonalAnime"];
}

export const AnimeCarousel = (props: AnimeCarouselProps) => {
  const { carouselApi, setCarouselApi, count, current } = useCarouselApi();

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
                <div className="absolute bottom-3 left-3 z-20 col-span-2 flex w-full select-none flex-col justify-center md:static md:z-0">
                  <h1 className="mb-2 line-clamp-1 text-xl font-bold md:mb-5 md:line-clamp-3 md:text-5xl">
                    {anime.title}
                  </h1>
                  <div className="mb-3 hidden gap-2 md:flex">
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
                  <p className="mb-2 line-clamp-3 hidden text-sm text-muted-foreground md:mb-5 md:[display:-webkit-box]">
                    {anime.synopsis}
                  </p>
                  <Button className="flex w-fit items-center gap-2" asChild>
                    <Link href={`/anime/${anime.animeId}`}>
                      <PlayIcon className="h-5 w-5" />
                      Watch Now
                    </Link>
                  </Button>
                </div>
                <div className="relative col-span-3 aspect-video w-full overflow-hidden rounded-md">
                  <div className="absolute left-0 top-0 z-10 h-full w-full bg-gradient-to-t from-black to-transparent md:bg-none"></div>
                  <Image
                    src={
                      anime.bannerImage?.length
                        ? anime.bannerImage
                        : anime.images.webp.large_image_url
                    }
                    alt={anime.title}
                    className="h-full w-full rounded-lg object-cover object-center shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src =
                        anime.images.webp.large_image_url ?? "";
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
