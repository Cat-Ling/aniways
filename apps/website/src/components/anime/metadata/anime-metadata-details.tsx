import Link from "next/link";

import type { RouterOutputs } from "@aniways/api";
import { Image } from "@aniways/ui/aniways-image";
import { Button } from "@aniways/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@aniways/ui/credenza";

import { AnimeChooser } from "./anime-chooser";
import { MyAnimeListButton } from "./myanimelist-button";
import { Trailer } from "./trailer";

interface AnimeMetadataProps {
  anime: Exclude<RouterOutputs["anime"]["byId"], undefined>;
  metadata: Exclude<
    RouterOutputs["myAnimeList"]["getAnimeMetadata"],
    undefined
  >;
}

export const AnimeMetadataDetails = ({
  anime,
  metadata,
}: AnimeMetadataProps) => {
  return (
    <div className="mb-6 grid min-h-[400px] w-full grid-cols-1 gap-6 md:grid-cols-4">
      <Image
        src={metadata.main_picture.large}
        alt={anime.title}
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
          <div className="mt-2 flex flex-col justify-start gap-3 md:flex-row">
            {[
              metadata.media_type,
              metadata.rating,
              metadata.season,
              metadata.average_episode_duration,
              metadata.airingStatus,
            ].map((info, index) =>
              info ?
                <div
                  key={index}
                  className="rounded-md bg-muted p-2 text-sm text-primary"
                >
                  {info}
                </div>
              : null
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
                {isNaN(metadata.mean) ?
                  "N/A"
                : Intl.NumberFormat("en-US", {
                    minimumSignificantDigits: 3,
                  }).format(metadata.mean)
                }
              </span>{" "}
              ({Intl.NumberFormat("en-US").format(metadata.num_scoring_users)}{" "}
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
          <Credenza>
            <CredenzaTrigger asChild>
              <Button variant={"secondary"}>Report Wrong Information</Button>
            </CredenzaTrigger>
            <CredenzaContent>
              <CredenzaHeader>
                <CredenzaTitle>Report Wrong Information</CredenzaTitle>
                <CredenzaDescription>
                  Choose the correct Anime
                </CredenzaDescription>
              </CredenzaHeader>
              <CredenzaBody>
                <AnimeChooser query={anime.title} />
              </CredenzaBody>
            </CredenzaContent>
          </Credenza>
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
          <MyAnimeListButton metadata={metadata} />
        </div>
      </div>
    </div>
  );
};
