'use client';

import { schema } from '@aniways/database';
import { Button } from '@ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';
import { Skeleton } from '@ui/components/ui/skeleton';
import Link from 'next/link';
import { Suspense } from 'react';
import { AnimeChooser } from './_anime-chooser';
import { AddToListButton } from './_myanimelist-button/add-to-list-button';
import { UpdateAnimeForm } from './_myanimelist-button/update-anime-form';
import { useMetadata } from './metadata-provider';
import { Image } from '@ui/components/ui/aniways-image';

type AnimeMetadataClientProps = {
  anime: schema.Anime;
};

export const AnimeMetadataClient = ({ anime }: AnimeMetadataClientProps) => {
  const [details] = useMetadata();

  return (
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
            {[
              details.type,
              details.rating,
              details.duration,
              details.status,
            ].map(
              (info, index) =>
                info && (
                  <div
                    key={index}
                    className="bg-muted text-primary rounded-md p-2 text-sm"
                  >
                    {info}
                  </div>
                )
            )}
          </div>
          <div className="mt-2 grid w-full grid-cols-2 md:w-1/2">
            <div className="text-sm">
              <span className="text-muted-foreground">Genres: </span>
              {details.genres.map(genre => genre.name).join(', ')}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total Episodes: </span>
              {details.episodes ?? '???'}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Studios: </span>
              {details.studios.map(studio => studio.name).join(', ')}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Rank: </span>
              {details.rank}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Score: </span>
              <span className="font-bold">
                {Intl.NumberFormat('en-US', {
                  minimumSignificantDigits: 3,
                }).format(details.score ?? 0)}
              </span>{' '}
              ({Intl.NumberFormat('en-US').format(details.scored_by ?? 0)}{' '}
              users)
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Popularity: </span>
              {details.popularity}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Aired: </span>
              {(details.aired as any).string}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Source: </span>
              {details.source}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Status: </span>
              {details.listStatus ?
                details.listStatus?.status.charAt(0).toUpperCase() +
                details.listStatus?.status.slice(1).replace(/_/g, ' ')
              : 'Not in list'}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Watched Episodes: </span>
              {details.listStatus?.num_episodes_watched ?? 0}
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
          <Button variant={'secondary'} asChild>
            <Link
              className="w-full md:w-fit"
              href={
                details.url ?? `https://myanimelist.net/anime/${details.mal_id}`
              }
              target="_blank"
            >
              MyAnimeList
            </Link>
          </Button>
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
          {!details.listStatus ?
            <AddToListButton malId={details.mal_id!} />
          : <Dialog>
              <DialogTrigger asChild>
                <Button>Update Anime</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Update Anime - {details.title}</DialogTitle>
                <DialogDescription>
                  Update the anime in your MyAnimeList Anime List
                </DialogDescription>
                <UpdateAnimeForm
                  malId={details.mal_id!}
                  listStatus={details.listStatus}
                />
              </DialogContent>
            </Dialog>
          }
        </div>
      </div>
    </div>
  );
};
