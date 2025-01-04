"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchFilterItems, type SearchFilters } from "@/server/hianime/search";
import { Filter, RotateCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const FilterForm = () => {
  const searchParams = useSearchParams();

  const [state, setState] = useState<SearchFilters>({
    sort: "default",
  });

  const url = useMemo(() => {
    const urlSearchParams = new URLSearchParams({
      query: searchParams.get("query") ?? "",
    });

    Object.entries(state).forEach(([key, value]) => {
      if (!value) return;
      if (typeof value === "string") {
        urlSearchParams.set(key, value);
        return;
      }
      urlSearchParams.set(key, value.join(","));
    });

    const search = urlSearchParams.toString();

    return `/search${search ? `?${search}` : ""}`;
  }, [state, searchParams]);

  useEffect(() => {
    const params = { sort: "default" } as SearchFilters;

    searchParams.entries().forEach(([key, value]) => {
      if (key === "genres") {
        Object.assign(params, { genres: value.split(",") });
        return;
      }

      Object.assign(params, { [key]: value });
    });

    setState(params);
  }, [searchParams]);

  return (
    <div className="mb-6 divide-y divide-dashed rounded-md border border-border bg-background p-6">
      <section className="pb-2">
        <h2 className="text-lg font-bold">Filter</h2>
        <div className="my-3 grid grid-cols-2 gap-2 md:grid-cols-3">
          {Object.entries(SearchFilterItems)
            .filter(([key]) => key !== "genres")
            .map(([key, filter]) => (
              <Select
                key={key}
                value={(state[key as keyof SearchFilters] ?? "all") as string}
                onValueChange={(value) => {
                  if (value === "all") {
                    return setState((prev) => ({
                      ...prev,
                      [key]: undefined,
                    }));
                  }
                  return setState((prev) => ({ ...prev, [key]: value }));
                }}
              >
                <SelectTrigger className="relative justify-between text-xs md:text-base">
                  <div>
                    <span className="mr-2 font-bold capitalize text-muted-foreground">
                      {key}
                    </span>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {key !== "sort" && <SelectItem value="all">All</SelectItem>}
                  {filter.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
        </div>
      </section>

      <section className="py-3">
        <h2 className="text-lg font-bold">Genre</h2>
        <div className="mt-3 flex max-h-28 flex-wrap overflow-y-auto md:max-h-none">
          {SearchFilterItems.genres.map((genre) => (
            <Button
              key={genre.value}
              variant={
                state.genres
                  ? state.genres.includes(genre.value)
                    ? "default"
                    : "secondary"
                  : "secondary"
              }
              size={"sm"}
              className={"mb-2 mr-2"}
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  genres: prev.genres
                    ? prev.genres.includes(genre.value)
                      ? prev.genres.filter((g) => g !== genre.value)
                      : [...prev.genres, genre.value]
                    : [genre.value],
                }));
              }}
            >
              {genre.label}
            </Button>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-2 pt-6">
        <Button asChild>
          <Link href={url}>
            <Filter />
            Filter
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href={`/search?query=${searchParams.get("query")}`}>
            <RotateCw />
            Reset
          </Link>
        </Button>
      </div>
    </div>
  );
};
