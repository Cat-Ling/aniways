import { Skeleton } from '@aniways/ui/components/ui/skeleton';

export const PaginationLoader = () => {
  return (
    <div className="grid h-[40px] w-[120px] grid-cols-3 items-center">
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
    </div>
  );
};
