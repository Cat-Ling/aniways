import { Skeleton } from '@aniways/ui/components/ui/skeleton';

export const AnimeGridLoader = () => {
  return (
    <ul className="grid h-full grid-cols-6 gap-3">
      {Array.from({ length: 24 }).map((_, i) => (
        <Skeleton key={i} className="h-[380px]" />
      ))}
    </ul>
  );
};
