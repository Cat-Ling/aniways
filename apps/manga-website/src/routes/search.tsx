import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Library } from "lucide-react";
import { z } from "zod";

import { Button } from "@aniways/ui/button";
import { Skeleton } from "@aniways/ui/skeleton";

import { MainLayout } from "../components/layout";
import { api } from "../trpc";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ query: z.string() }),
  component: SearchPage,
});

function SearchPage() {
  const search = useSearch({
    from: "/search",
  });

  const results = api.manga.search.useQuery(search);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold">Search</h1>
      <p className="text-muted-foreground">
        Showing Results for{" "}
        <span className="text-foreground">{search.query}</span>
      </p>
      <Button asChild variant={"link"} className="h-fit px-0">
        <Link to="/" resetScroll>
          {"<<< Go back to home"}
        </Link>
      </Button>
      <div className="my-6 grid h-full grid-cols-2 gap-3 md:grid-cols-5">
        {results.isLoading &&
          Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-md" />
          ))}
        {results.data?.results.map(manga => (
          <Link
            key={manga.id}
            to={"/manga/$id"}
            params={{ id: manga.id }}
            className="group flex flex-col gap-3 rounded-md border border-border bg-background p-2"
            resetScroll
          >
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-muted/70 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                <Library className="h-8 w-8 text-primary" />
                <p className="mt-2 text-lg font-bold text-foreground">
                  Read Now
                </p>
              </div>
              <img
                src={manga.image}
                alt={manga.title}
                className="aspect-[3/4] w-full overflow-hidden rounded-md border border-border bg-background object-cover object-center"
              />
            </div>
            <p className="line-clamp-2 text-xs transition group-hover:text-primary md:text-sm">
              {manga.title}
            </p>
          </Link>
        ))}
      </div>
    </MainLayout>
  );
}
