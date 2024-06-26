import type { ReactNode } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@aniways/ui/skeleton";

import ErrorPage from "../../../../../error";
import { AnimeMetadata } from "./_metadata";

interface AnimePageLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

const AnimePageLayout = ({
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
