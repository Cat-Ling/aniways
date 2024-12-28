import { type RouterOutputs } from "@/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Image } from "../ui/image";

type TopAnimeProps = {
  topAnime: RouterOutputs["hiAnime"]["getTopAnime"];
};

export const TopAnime = async ({ topAnime }: TopAnimeProps) => {
  return (
    <Tabs defaultValue="today">
      <div className="flex w-full flex-col gap-3">
        <h1 className="text-lg font-bold md:text-2xl">Top 10 Anime</h1>
        <TabsList className="grid w-full grid-cols-3 gap-1 bg-background">
          <TabsTrigger
            value="today"
            className="hover:bg-muted data-[state=active]:bg-primary data-[state=active]:hover:bg-primary"
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value="week"
            className="hover:bg-muted data-[state=active]:bg-primary data-[state=active]:hover:bg-primary"
          >
            Week
          </TabsTrigger>
          <TabsTrigger
            value="month"
            className="hover:bg-muted data-[state=active]:bg-primary data-[state=active]:hover:bg-primary"
          >
            Month
          </TabsTrigger>
        </TabsList>
      </div>
      {(["today", "week", "month"] as const).map((value) => (
        <TabsContent
          key={value}
          value={value}
          className={
            'flex-col gap-3 rounded-md p-3 data-[state="active"]:flex data-[state="active"]:bg-muted'
          }
        >
          {topAnime[value].map((anime, index) => (
            <Link
              key={anime.id}
              className="group flex items-center gap-1 transition"
              href={`/anime/${anime.id}`}
            >
              <div className="-mt-3 w-8 text-lg font-bold text-muted-foreground transition group-hover:text-foreground">
                {`0${index + 1}`.slice(-2)}
              </div>
              <div className="w-full">
                <div className="grid w-full grid-cols-5 items-center gap-3">
                  <Image
                    src={anime.poster ?? ""}
                    alt={anime.jname ?? ""}
                    className="col-span-1 aspect-[450/650] w-full overflow-hidden rounded-md"
                  />
                  <div className="col-span-4 flex flex-col justify-between">
                    <p className="line-clamp-2 text-xs transition group-hover:text-primary md:text-sm">
                      {anime.jname ?? "????"}
                    </p>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      {anime.episodes.sub} episodes
                    </p>
                  </div>
                </div>
                <div
                  role="separator"
                  className={cn(
                    "mt-3 border-b border-muted-foreground/20",
                    index === topAnime[value].length - 1 && "hidden",
                  )}
                />
              </div>
            </Link>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};
