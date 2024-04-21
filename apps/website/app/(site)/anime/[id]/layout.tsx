import { Skeleton } from '@aniways/ui/components/ui/skeleton';
import { ReactNode, Suspense } from 'react';
import { AnimeMetadata } from './_metadata';

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
  return (
    <>
      {children}
      <Suspense fallback={<Skeleton className="mb-6 h-[500px] w-full" />}>
        <AnimeMetadata id={id} />
      </Suspense>
    </>
  );
};

export default AnimePageLayout;
