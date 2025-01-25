import { FilterForm } from "@/components/anime/search/filter-form";
import { type ReactNode } from "react";

type SearchLayoutProps = {
  children: ReactNode;
};

const SearchLayout = ({ children }: SearchLayoutProps) => {
  return (
    <>
      <FilterForm />
      {children}
    </>
  );
};

export default SearchLayout;
