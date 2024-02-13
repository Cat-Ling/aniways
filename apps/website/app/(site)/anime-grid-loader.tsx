import { Skeleton } from '@aniways/ui/components/ui/skeleton';

export const AnimeGridLoader = () => {
  return (
    <ul className="grid h-full grid-cols-2 gap-3 md:grid-cols-5">
      {Array.from({ length: 24 }).map((_, i) => (
        <Skeleton key={i} className="h-[262px] md:h-[440px]" />
      ))}
    </ul>
  );
};
