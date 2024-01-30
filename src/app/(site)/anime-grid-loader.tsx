import { Skeleton } from '@/components/ui/skeleton';

export const AnimeGridLoader = () => {
  return (
    <ul className="grid grid-cols-6 gap-3 h-full">
      {Array.from({ length: 24 }).map((_, i) => (
        <Skeleton key={i} className="h-[380px]" />
      ))}
    </ul>
  );
};
