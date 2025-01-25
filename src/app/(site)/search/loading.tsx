import { FilterForm } from "@/components/anime/search/filter-form";
import { AnimeGridLoader } from "@/components/layouts/anime-grid-loader";

const SearchLoading = () => {
  return (
    <>
      <FilterForm />
      <div className="mb-6 flex w-full flex-col justify-between gap-3 md:mb-5 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Search</h1>
        </div>
      </div>
      <AnimeGridLoader />
    </>
  );
};

export default SearchLoading;
