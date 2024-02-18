'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@ui/components/ui/button';
import { DialogClose, DialogFooter } from '@ui/components/ui/dialog';
import { Skeleton } from '@ui/components/ui/skeleton';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { searchAnimeAction } from './search-anime-action';
import { updateMalAnimeAction } from './update-mal-anime-action';
import { toast } from '@ui/components/ui/sonner';

type AnimeChooserClientProps = {
  query: string;
};

export const AnimeChooserClient = ({ query }: AnimeChooserClientProps) => {
  const params = useParams();
  const [page, setPage] = useState(1);

  const { isLoading, data, isError } = useQuery({
    queryKey: ['searchAnime', query, page],
    queryFn: () => searchAnimeAction(query, page),
  });

  if (isError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  if (isLoading) {
    return <Skeleton className="h-[480px] w-full" />;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {data?.data?.map(anime => (
        <DialogClose
          key={anime.mal_id}
          onClick={async () => {
            const id = params.id;
            if (!id || typeof id !== 'string') return;
            if (!anime.mal_id) return;
            await updateMalAnimeAction(id, anime.mal_id);
            toast('Anime updated successfully', {
              description: 'Thanks for updating the anime!',
            });
          }}
          asChild
        >
          <Button
            className="flex h-fit w-full items-start justify-start gap-4 whitespace-normal text-wrap break-words text-left"
            variant={'ghost'}
          >
            <Image
              src={anime.images.jpg.image_url ?? ''}
              alt={anime.title ?? ''}
              width={100}
              height={100 * (650 / 450)}
              className="bg-muted border-border hidden aspect-[450/650] h-auto w-[100px] rounded-md border object-contain md:block"
            />
            <div className="flex h-full flex-col justify-center gap-2">
              <h2 className="text-sm font-bold md:text-base">{anime.title}</h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                {anime.title_english}
              </p>
              <div className="flex items-center gap-2">
                <p className="bg-muted text-primary w-fit rounded-md p-2 text-xs md:text-sm">
                  {anime.type}
                </p>
                <p className="bg-muted text-primary w-fit rounded-md p-2 text-xs md:text-sm">
                  {anime.status}
                </p>
                <p className="bg-muted text-primary w-fit rounded-md p-2 text-xs md:text-sm">
                  {anime.episodes ?? '?'}{' '}
                  <span className="hidden md:block">episodes</span>
                </p>
              </div>
            </div>
          </Button>
        </DialogClose>
      ))}
      <DialogFooter>
        <div className="flex w-full justify-between">
          {page > 1 ?
            <Button
              variant={'secondary'}
              onClick={() => setPage(page => page - 1)}
            >
              Previous
            </Button>
          : <div></div>}
          {data?.pagination.has_next_page ?
            <Button
              variant={'secondary'}
              onClick={() => setPage(page => page + 1)}
            >
              Next
            </Button>
          : <div></div>}
        </div>
      </DialogFooter>
    </div>
  );
};
