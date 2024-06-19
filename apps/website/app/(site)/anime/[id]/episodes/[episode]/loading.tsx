import { Skeleton } from '@aniways/ui/components/ui/skeleton';

const AnimeStreamingPageLoadingPage = () => {
  return (
    <>
      <div className="mb-3">
        <Skeleton className="mb-2 h-7 w-96" />
        <Skeleton className="h-6 w-64" />
      </div>
      <div className="mb-5 flex aspect-video w-full flex-col gap-2">
        <div className="flex-1">
          <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
        </div>
        <Skeleton className="mb-6 mt-3 h-10 w-full" />
        <h2 className="mb-3 text-lg font-semibold">Episodes</h2>
        <Skeleton className="mb-6 h-10 w-full" />
      </div>
    </>
  );
};

export default AnimeStreamingPageLoadingPage;
