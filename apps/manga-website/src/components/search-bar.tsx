import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { cn } from "@aniways/ui";
import { Button } from "@aniways/ui/button";
import { Input } from "@aniways/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@aniways/ui/popover";

interface SearchBarProps {
  mobile?: boolean;
}

export const SearchBar = ({ mobile }: SearchBarProps) => {
  return mobile ? <MobileSearchInput /> : <SearchInput />;
};

const MobileSearchInput = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size="icon">
          <span className="sr-only">Search</span>
          <Search />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mt-3 w-screen rounded-none bg-background">
        <p className="mb-2 font-bold">Search for manga</p>
        <SearchInput />
      </PopoverContent>
    </Popover>
  );
};

const SearchInput = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const params = useMemo(() => {
    if (query === "") {
      return {
        to: "/",
      } satisfies Parameters<typeof navigate>[0];
    }

    return {
      to: "/search",
      search: {
        query,
      },
    } satisfies Parameters<typeof navigate>[0];
  }, [query]);

  return (
    <div className="group relative">
      <Input
        placeholder="Search for manga"
        className={cn("h-10 w-full pl-9 pr-36 md:w-80")}
        autoComplete="off"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
        }}
        onKeyDown={e => {
          if (e.key !== "Enter") return;
          void navigate(params);
        }}
      />
      <Button
        type="button"
        variant="link"
        size="sm"
        tabIndex={-1}
        className={cn(
          "pointer-events-none absolute right-24 top-1/2 -translate-y-1/2 p-0 text-muted-foreground opacity-0 transition group-focus-within:pointer-events-auto group-focus-within:opacity-100 ",
          {
            "opacity-100": query.length > 0,
          }
        )}
        onClick={e => {
          e.currentTarget.blur();
          setQuery("");
          void navigate({
            to: "/",
          });
        }}
      >
        Clear
      </Button>
      <Button
        className="absolute right-0 top-0 ml-2"
        onClick={() => {
          void navigate(params);
        }}
      >
        Search
      </Button>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        size={18}
      />
    </div>
  );
};
