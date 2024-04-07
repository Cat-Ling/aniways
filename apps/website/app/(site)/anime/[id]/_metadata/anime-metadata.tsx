import { auth } from '@aniways/myanimelist';
import { db, schema, orm } from '@aniways/database';
import { getAnimeDetailsFromMyAnimeList } from '@aniways/myanimelist';
import { cookies } from 'next/headers';
import { MetadataProvider } from './metadata-provider';
import { AnimeMetadataClient } from './anime-metadata-client';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@ui/components/ui/skeleton';
import { Play } from 'lucide-react';

type AnimeMetadataProps = {
  anime: schema.Anime;
};

export const AnimeMetadata = async ({ anime }: AnimeMetadataProps) => {
  const user = await auth(cookies());

  const details = await getAnimeDetailsFromMyAnimeList({
    accessToken: user?.accessToken,
    ...(anime.malAnimeId ?
      { malId: anime.malAnimeId }
    : { title: anime.title }),
  });

  if (!anime.malAnimeId && details?.mal_id) {
    await db
      .update(schema.anime)
      .set({ malAnimeId: details.mal_id })
      .where(orm.eq(schema.anime.id, anime.id));
  }

  if (!details) return null;

  const relatedAnime = (
    await Promise.all(
      details.relatedAnime.map(async anime => ({
        ...anime,
        id: await db.query.anime
          .findFirst({
            where: (fields, actions) => {
              return actions.eq(fields.malAnimeId, anime.node.id);
            },
            columns: {
              id: true,
            },
          })
          .then(data => data?.id),
      }))
    )
  ).sort((a, b) => {
    if (a.relation_type === 'side_story') return 1;
    if (b.relation_type === 'side_story') return -1;
    return 0;
  });

  return (
    <MetadataProvider metadata={details}>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
      <AnimeMetadataClient anime={anime} />
      {details.relatedAnime.length > 0 && (
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
      )}
    </MetadataProvider>
  );
};
