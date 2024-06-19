import { Skeleton } from '@aniways/ui/components/ui/skeleton';
import { ReactNode, Suspense } from 'react';
import { AnimeMetadata } from './_metadata';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorPage from '../../../../../error';

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
      <ErrorBoundary errorComponent={ErrorPage}>
        <Suspense fallback={<Skeleton className="mb-6 h-[500px] w-full" />}>
          <AnimeMetadata id={id} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default AnimePageLayout;
