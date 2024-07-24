import { createFileRoute, useSearch } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ query: z.string() }),
  component: SearchPage,
});

function SearchPage() {
  const search = useSearch({
    from: "/search",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Search</h1>
      <span>{search.query}</span>
    </div>
  );
}
