import { Skeleton } from "../ui/skeleton";

export const AnimeGridLoader = ({
  length = 18,
  featured,
}: {
  length?: number;
  featured?: boolean;
}) => {
  return (
    <>
      {featured && (
        <ul className="mb-3 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] md:h-[420px]" />
          ))}
        </ul>
      )}
      <ul className="grid w-full grid-cols-2 gap-3 md:grid-cols-6">
        {Array.from({ length }).map((_, i) => (
          <Skeleton key={i} className="h-[300px]" />
        ))}
      </ul>
    </>
  );
};
