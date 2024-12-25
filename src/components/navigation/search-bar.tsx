"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const SearchBarFallback = () => {
  return (
    <div className="group relative">
      <Input
        placeholder="Search for anime"
        className={cn("w-full pl-9")}
        disabled
      />
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        size={18}
      />
    </div>
  );
};

export const SearchBar = () => {
  const ref = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") ?? "";
  const [hasText, setHasText] = useState(false);

  useEffect(() => {
    if (pathname === "/search") return;
    if (!ref.current) return;
    ref.current.value = "";
    setHasText(false);
  }, [pathname, searchParams]);

  return (
    <form
      className="group relative"
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const query = formData.get("query") as string;

        if (query === "") return router.push("/", { scroll: false });

        router.push(`/search?query=${query}`);
      }}
    >
      <Input
        ref={ref}
        name="query"
        placeholder="Search for anime"
        className={cn("h-10 w-full pl-9 pr-36 md:w-80")}
        defaultValue={query}
        autoComplete="off"
        onChange={(e) => setHasText(e.currentTarget.value !== "")}
      />
      <Button
        type="button"
        variant="link"
        size="sm"
        tabIndex={-1}
        className={cn(
          "pointer-events-none absolute right-24 top-1/2 -translate-y-1/2 p-0 text-muted-foreground opacity-0 transition group-focus-within:pointer-events-auto group-focus-within:opacity-100",
          {
            "opacity-100": hasText,
          },
        )}
        onClick={(e) => {
          e.currentTarget.blur();
          if (!ref.current) return;
          ref.current.value = "";
          setHasText(false);
          router.push("/", { scroll: false });
        }}
      >
        Clear
      </Button>
      <Button type="submit" className="absolute right-0 top-0 ml-2">
        Search
      </Button>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        size={18}
      />
    </form>
  );
};
