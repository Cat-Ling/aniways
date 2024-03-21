'use client';

import { schema } from '@aniways/database';
import { Button } from '@ui/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@ui/components/ui/carousel';
import { PlayIcon } from 'lucide-react';
import Link from 'next/link';
import { getCurrentAnimeSeason } from '@aniways/myanimelist';
import { useEffect, useState } from 'react';

type AnimeCarouselProps = {
  seasonalAnime: Awaited<ReturnType<typeof getCurrentAnimeSeason>>['data'];
  animeMap: Record<number, schema.Anime>;
};

export const AnimeCarousel = ({
  seasonalAnime,
  animeMap,
}: AnimeCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [api, current]);

  return (
    <Carousel
      className="relative mb-12"
      setApi={setApi}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {seasonalAnime.map(anime => {
          const animeFromDB = animeMap[anime.mal_id!];

          const url =
            animeFromDB ?
              `/anime/${animeFromDB.id}`
            : '/search?query=' + anime.title;

          return (
            <CarouselItem key={anime.mal_id}>
              <div className="flex w-full flex-col-reverse gap-3 md:grid md:grid-cols-5 md:gap-6">
                <div className="col-span-2 flex flex-col justify-center">
                  <h1 className="mb-2 text-2xl font-bold md:mb-5 md:text-5xl">
                    {anime.title}
                  </h1>
                  <div className="mb-3 flex gap-2">
                    <span className="bg-muted text-primary rounded-md p-2 text-sm">
                      {anime.rating}
                    </span>
                    <span className="bg-muted text-primary rounded-md p-2 text-sm">
                      {anime.type}
                    </span>
                    <span className="bg-muted text-primary rounded-md p-2 text-sm">
                      {anime.episodes ?? '???'} episodes
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-2 line-clamp-3 text-sm md:mb-5">
                    {anime.synopsis}
                  </p>
                  <Button className="flex w-fit items-center gap-2" asChild>
                    <Link href={url}>
                      <PlayIcon className="h-5 w-5" />
                      Watch Now
                    </Link>
                  </Button>
                </div>
                <div className="relative col-span-3 aspect-video w-full overflow-hidden rounded-md p-2">
                  <div
                    className="absolute bottom-0 left-0 right-0 top-0 -m-2 h-full w-full bg-cover bg-no-repeat blur-xl"
                    style={{
                      backgroundImage: `url(${anime.images.webp.large_image_url})`,
                    }}
                  />
                  <div className="relative z-10 flex aspect-video h-full w-full items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
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
      <div className="absolute bottom-0 left-0 m-2">
        {Array.from({ length: count }).map((_, i) => (
          <Button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`mx-1 h-2 w-2 rounded-full p-0`}
            variant={i === current - 1 ? 'default' : 'secondary'}
          />
        ))}
      </div>
    </Carousel>
  );
};
