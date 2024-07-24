import { Search } from "lucide-react";

import { Button } from "@aniways/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@aniways/ui/popover";

import { SearchBar } from "./search-bar";

export const SearchBtn = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size="icon">
          <span className="sr-only">Open search</span>
          <Search />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen rounded-none bg-background p-3">
        <p className="mb-2 mt-1 font-bold">Search for anime</p>
        <SearchBar />
      </PopoverContent>
    </Popover>
  );
};
