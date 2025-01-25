import { FilterForm } from "@/components/anime/search/filter-form";
import { Suspense, type ReactNode } from "react";

type SearchLayoutProps = {
  children: ReactNode;
};

const SearchLayout = ({ children }: SearchLayoutProps) => {
  return (
    <>
      <Suspense>
        <FilterForm />
      </Suspense>
      {children}
    </>
  );
};

export default SearchLayout;
