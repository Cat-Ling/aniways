import { Mal } from "@/components/mal/mal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/server/auth";
import { type RouterInputs } from "@/trpc/react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

type Status = RouterInputs["mal"]["getAnimeListOfUser"]["status"];

const statusMap: Record<Status, string> = {
  all: "All",
  watching: "Watching",
  completed: "Completed",
  on_hold: "On Hold",
  dropped: "Dropped",
  plan_to_watch: "Plan To Watch",
};

interface AnimeListPageProps {
  searchParams: Promise<{ status?: Status }>;
}

const AnimeListPage = async ({ searchParams }: AnimeListPageProps) => {
  const { status = "all" } = await searchParams;

  const session = await auth(await cookies());

  if (!session?.user) {
    redirect("/", RedirectType.replace);
  }

  const { user } = session;

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue={status}>
        <div className="flex w-full flex-col gap-6 md:mb-3">
          <h1 className="text-2xl">
            <span className="font-bold">{user.name}&apos;s</span> Anime List
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
      <Mal status={status} />
    </div>
  );
};

export default AnimeListPage;
