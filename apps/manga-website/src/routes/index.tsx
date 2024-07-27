import { createFileRoute } from "@tanstack/react-router";

import { api } from "../trpc";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const library = api.manga.getLibrary.useQuery();

  return (
    <div>
      Home
      <pre>{JSON.stringify(library, null, 2)}</pre>
    </div>
  );
}
