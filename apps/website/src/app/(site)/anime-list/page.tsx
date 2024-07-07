import { cookies } from "next/headers";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

import type { RouterInputs } from "@aniways/api";
import { auth } from "@aniways/auth/server";
import { Tabs, TabsList, TabsTrigger } from "@aniways/ui/tabs";

import { AnimeList } from "~/components/anime-list/anime-list";

type Status = RouterInputs["myAnimeList"]["getAnimeListOfUser"]["status"];

const statusMap: Record<Status, string> = {
  all: "All",
  watching: "Watching",
  completed: "Completed",
  on_hold: "On Hold",
  dropped: "Dropped",
  plan_to_watch: "Plan To Watch",
};

interface AnimeListPageProps {
  searchParams: { status?: Status };
}

const AnimeListPage = async ({
  searchParams: { status = "all" },
}: AnimeListPageProps) => {
  const session = await auth(cookies());

  if (!session?.user) {
    redirect("/", RedirectType.replace);
  }

  const { user } = session;

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue={status}>
        <div className="flex w-full flex-col gap-6 md:mb-3">
          <h1 className="text-2xl">
            <span className="font-bold">{user.name}'s</span> Anime List
          </h1>
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <TabsList className="flex h-fit max-w-full flex-wrap">
              {Object.entries(statusMap).map(([key, value]) => (
                <TabsTrigger key={key} value={key} asChild>
                  <Link href={`?status=${key}`}>{value}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </Tabs>
      <AnimeList status={status} />
    </div>
  );
};

export default AnimeListPage;
