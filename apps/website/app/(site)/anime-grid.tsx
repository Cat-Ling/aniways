import { Play } from 'lucide-react';
import Link from 'next/link';
import { schema } from '@aniways/data-access';
import { Skeleton } from '@ui/components/ui/skeleton';
import Image from 'next/image';

type AnimeGridProps = {
  type: 'home' | 'search';
  animes: schema.Anime[];
};

export const AnimeGrid = (props: AnimeGridProps) => {
  const { animes, type } = props;

  return (
    <ul className="grid h-full grid-cols-2 gap-3 md:grid-cols-5">
      {animes.map(anime => {
        const { title, lastEpisode, image, id } = anime;

        const url =
          type === 'home' ?
            `/anime/${id}/episodes/${lastEpisode}`
          : `/anime/${id}`;

        return (
          <li
            key={anime.title + anime.lastEpisode + anime.slug}
            className="bg-background border-border group rounded-md border p-2"
          >
            <Link href={url} className="flex h-full flex-col gap-3">
              <div className="relative">
                <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
                  <Skeleton className="absolute z-0 h-full w-full rounded-md" />
                  <Image
                    src={image}
                    alt={title}
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
                  {title}
                </p>
                <p className="text-muted-foreground mt-1 text-xs md:text-sm">
                  {type === 'home' ?
                    `Episode ${lastEpisode}`
                  : `${lastEpisode} episodes`}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
