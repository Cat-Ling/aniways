"use client";

import Link from "next/link";

import type { RouterOutputs } from "@/trpc/react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";

import { MalButton } from "./mal-button";
import { Trailer } from "./trailer";
import { Skeleton } from "@/components/ui/skeleton";

interface AnimeMetadataProps {
  metadata: Exclude<RouterOutputs["mal"]["getAnimeInfo"], undefined>;
}

export const AnimeMetadataDetails = ({ metadata }: AnimeMetadataProps) => {
  return (
    <div className="mb-6 grid min-h-[400px] w-full grid-cols-1 gap-6 md:grid-cols-4">
      <Image
        src={metadata.main_picture?.large}
        alt={metadata.title}
        width={300}
        height={400}
        className="w-full rounded-md border border-border object-cover"
      />
      <div className="flex flex-col gap-3 md:col-span-3">
        <div>
          <h2 className="text-2xl font-bold">{metadata.title}</h2>
          <p className="text-sm text-muted-foreground">
            {metadata.alternative_titles?.en}
          </p>
          <div className="mt-2 flex flex-col justify-start gap-1 md:flex-row">
            {[
              metadata.media_type,
              metadata.rating,
              metadata.season,
              metadata.average_episode_duration,
              metadata.airingStatus,
            ].map((info, index) =>
              info ? (
                <div
                  key={index}
                  className="rounded-md bg-muted p-2 text-sm text-primary"
                >
                  {info}
                </div>
              ) : null,
            )}
          </div>
          <div className="mt-2 grid w-full grid-cols-2 md:w-1/2">
            <div className="text-sm">
              <span className="text-muted-foreground">Genres: </span>
              {metadata.genreString}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total Episodes: </span>
              {metadata.totalEpisodes}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Studios: </span>
              {metadata.studiosString}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Rank: </span>
              {metadata.rank ?? "N/A"}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Score: </span>
              <span className="font-bold">
                {isNaN(Number(metadata.mean))
                  ? "N/A"
                  : Intl.NumberFormat("en-US", {
                      minimumSignificantDigits: 3,
                    }).format(Number(metadata.mean))}
              </span>{" "}
              (
              {Intl.NumberFormat("en-US").format(
                Number(metadata.num_scoring_users),
              )}{" "}
              users)
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Popularity: </span>
              {metadata.popularity}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Aired: </span>
              {metadata.airingDate}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Source: </span>
              {metadata.source}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Status: </span>
              {metadata.listStatusFormatted}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Watched Episodes: </span>
              {metadata.listStatus?.num_episodes_watched ?? 0}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{metadata.synopsis}</p>
        <div className="flex flex-col gap-2 md:flex-row">
          <Button variant={"secondary"} asChild>
            <Link
              className="w-full md:w-fit"
              href={`https://myanimelist.net/anime/${metadata.id}`}
              target="_blank"
            >
              MyAnimeList
            </Link>
          </Button>
          <Trailer malId={metadata.id} title={metadata.title} />
          <MalButton metadata={metadata} />
        </div>
      </div>
    </div>
  );
};

export const AnimeMetadataLoader = () => {
  return (
    <div className="mb-6 grid min-h-[400px] w-full grid-cols-1 gap-6 md:grid-cols-4">
      <Skeleton className="aspect-[3/4] w-full rounded-md border border-border object-cover" />
      <div className="flex flex-col gap-3 md:col-span-3">
        <div>
          <Skeleton className="mb-2 h-6 w-1/3 text-2xl font-bold" />
          <Skeleton className="h-4 w-1/4 text-sm text-muted-foreground" />
          <Skeleton className="mt-2 flex h-10 w-3/5 flex-col justify-start gap-3 md:flex-row" />
          <div className="mt-2 grid w-full grid-cols-2 gap-1 md:w-1/2">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full text-sm" />
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-4 w-full text-sm" />
          <Skeleton className="h-4 w-full text-sm" />
          <Skeleton className="h-4 w-full text-sm" />
          <Skeleton className="h-4 w-3/4 text-sm" />
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
};
