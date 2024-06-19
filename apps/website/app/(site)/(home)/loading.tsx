import { Skeleton } from '@ui/components/ui/skeleton';
import { AnimeGridLoader } from '../anime-grid';
import { PaginationLoader } from '../pagination';

const HomePageLoading = () => {
  return (
    <>
      <Skeleton className="mb-2 h-[430px] md:mb-5" />
      <Skeleton className="mb-2 h-[32px] md:mb-5" />
      <div className="mb-12">
        <AnimeGridLoader length={5} />
      </div>
      <div
        id={'recently-released'}
        className="mb-6 flex w-full flex-col justify-between gap-3 pt-6 md:mb-5 md:flex-row md:items-center md:gap-0"
      >
        <h1 className="text-lg font-bold md:text-2xl">Recently Released</h1>
        <PaginationLoader />
      </div>
      <div className="mb-12">
        <AnimeGridLoader />
      </div>
      <div className="-my-6">
        <PaginationLoader />
      </div>
    </>
  );
};

export default HomePageLoading;
