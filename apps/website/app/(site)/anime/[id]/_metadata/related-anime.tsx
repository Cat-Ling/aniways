import { transformRelatedAnime } from '@aniways/data';
import { getAnimeMetadataFromMAL } from '@aniways/data';
import { Image } from '@aniways/ui/components/ui/aniways-image';
import { Skeleton } from '@aniways/ui/components/ui/skeleton';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

type RelatedAnimeProps = {
  details: Awaited<ReturnType<typeof getAnimeMetadataFromMAL>>;
};

export const RelatedAnime: FC<RelatedAnimeProps> = async props => {
  const { details } = props;

  const relatedAnime = await transformRelatedAnime(details);

  if (relatedAnime.length === 0) return null;

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Related Anime</h3>
      <section className="grid h-full grid-cols-2 gap-3 md:grid-cols-5">
        {relatedAnime.map(anime => {
          const url =
            anime.id ?
              `/anime/${anime.id}`
            : '/search?query=' + encodeURIComponent(anime.node.title);

          return (
            <Link
              href={url}
              key={anime.node.id}
              className="bg-background border-border group flex h-full flex-col gap-3 rounded-md border p-2"
            >
              <div className="relative">
                <div className="relative aspect-[450/650] w-full overflow-hidden rounded-md">
                  <Skeleton className="absolute z-0 h-full w-full rounded-md" />
                  <Image
                    src={anime.node.main_picture.large}
                    alt={anime.node.title}
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
                  {anime.node.title}
                </p>
                <p className="text-muted-foreground mt-1 text-xs md:text-sm">
                  {anime.relation_type_formatted}
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
};
