import { Skeleton } from '@/components/ui/skeleton';

export const PaginationLoader = () => {
  return (
    <div className="w-[120px] h-[40px] grid grid-cols-3 items-center">
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-full" />
    </div>
  );
};
