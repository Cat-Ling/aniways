import { Skeleton } from '@aniways/ui/components/ui/skeleton';

export const PaginationLoader = () => {
  return (
    <div className="grid h-[40px] w-full grid-cols-3 items-center md:w-[120px]">
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
    </div>
  );
};
