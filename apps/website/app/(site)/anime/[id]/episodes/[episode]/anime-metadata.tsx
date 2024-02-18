import { getUser } from '@animelist/auth-next/server';
import { db, schema, orm } from '@aniways/database';
import { getAnimeDetailsFromMyAnimeList } from '@aniways/myanimelist';
import { Button } from '@ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { AnimeChooser } from './anime-chooser';
import { Suspense } from 'react';
import { Skeleton } from '@ui/components/ui/skeleton';

type AnimeMetadataProps = {
  anime: schema.AnimeWithRelations;
};

export const AnimeMetadata = async ({ anime }: AnimeMetadataProps) => {
  const user = await getUser(cookies());

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

  console.log(details.mal_id);

  return (
    <>
      <h3 className="mb-3 mt-6 text-lg font-semibold">Anime Information</h3>
      <div className="mb-6 grid min-h-[400px] w-full grid-cols-1 gap-6 md:grid-cols-4">
        <Image
          src={details.images.jpg.large_image_url ?? anime.image}
          alt={anime.title}
          width={300}
          height={400}
          className="border-border w-full rounded-md border object-cover"
        />
        <div className="flex flex-col gap-3 md:col-span-3">
          <div>
            <h2 className="text-2xl font-bold">{details.title}</h2>
            <p className="text-muted-foreground text-sm">
              {details.title_english}
            </p>
            <div className="mt-2 flex flex-col justify-start gap-3 md:flex-row">
              <div className="bg-muted text-primary rounded-md p-2 text-sm">
                {details.type}
              </div>
              <div className="bg-muted text-primary rounded-md p-2 text-sm">
                {details.rating}
              </div>
              <div className="bg-muted text-primary rounded-md p-2 text-sm">
                {details.duration}
              </div>
              <div className="bg-muted text-primary rounded-md p-2 text-sm">
                {details.status}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-muted-foreground text-sm">
                <span className="text-foreground">Genres: </span>
                {details.genres.map(genre => genre.name).join(', ')}
              </div>
              <div className="text-muted-foreground text-sm">
                <span className="text-foreground">Total Episodes: </span>
                {details.episodes ?? '???'}
              </div>
              <div className="text-muted-foreground text-sm">
                <span className="text-foreground">Score: </span>
                <span className="font-bold">
                  {Intl.NumberFormat('en-US', {
                    minimumSignificantDigits: 3,
                  }).format(details.score ?? 0)}
                </span>{' '}
                ({Intl.NumberFormat('en-US').format(details.scored_by ?? 0)}{' '}
                users)
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">{details.synopsis}</p>
          <div className="flex flex-col gap-2 md:flex-row">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'secondary'}>Report Wrong Information</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Report Wrong Information</DialogTitle>
                <DialogDescription>Choose the correct Anime</DialogDescription>
                <Suspense fallback={<Skeleton className="h-[480px] w-full" />}>
                  <AnimeChooser query={anime.title} />
                </Suspense>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'secondary'}>View Trailer</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Trailer - {details.title}</DialogTitle>
                <iframe
                  className="aspect-video w-full"
                  src={details.trailer.embed_url}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </DialogContent>
            </Dialog>
            <Button>Add To List</Button>
          </div>
        </div>
      </div>
    </>
  );
};
