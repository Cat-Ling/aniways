import { Skeleton } from '@ui/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { AnimeMetadata } from './_metadata';
import { getAnimeById } from '@aniways/data';

type AnimePageLayoutProps = {
  children: ReactNode;
  params: {
    id: string;
  };
};

const AnimePageLayout = async ({
  children,
  params: { id },
}: AnimePageLayoutProps) => {
  const anime = await getAnimeById(id);

  if (!anime) notFound();

  return (
    <>
      {children}
      <Suspense fallback={<Skeleton className="mb-6 h-[500px] w-full" />}>
        <AnimeMetadata anime={anime} />
      </Suspense>
    </>
  );
};

export default AnimePageLayout;
