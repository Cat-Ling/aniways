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

import { AnimeChooser } from "./_anime-chooser";
import { MyAnimeListButton } from "./_myanimelist-button";

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
        src={metadata.images.jpg.large_image_url}
        alt={anime.title}
        width={300}
        height={400}
        className="w-full rounded-md border border-border object-cover"
      />
      <div className="flex flex-col gap-3 md:col-span-3">
        <div>
          <h2 className="text-2xl font-bold">{metadata.title}</h2>
          <p className="text-sm text-muted-foreground">
            {metadata.title_english}
          </p>
          <div className="mt-2 flex flex-col justify-start gap-3 md:flex-row">
            {[
              metadata.type,
              metadata.rating,
              `${metadata.season?.replace(/^\w/, c => c.toUpperCase())} ${metadata.year}`,
              metadata.duration,
              metadata.status,
            ].map(
              (info, index) =>
                info && (
                  <div
                    key={index}
                    className="rounded-md bg-muted p-2 text-sm text-primary"
                  >
                    {info}
                  </div>
                )
            )}
          </div>
          <div className="mt-2 grid w-full grid-cols-2 md:w-1/2">
            <div className="text-sm">
              <span className="text-muted-foreground">Genres: </span>
              {metadata.genres.map(genre => genre.name).join(", ")}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total Episodes: </span>
              {metadata.episodes ?? "???"}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Studios: </span>
              {metadata.studios.map(studio => studio.name).join(", ")}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Rank: </span>
              {metadata.rank}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Score: </span>
              <span className="font-bold">
                {Intl.NumberFormat("en-US", {
                  minimumSignificantDigits: 3,
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                }).format(metadata.score ?? 0)}
              </span>{" "}
              ({Intl.NumberFormat("en-US").format(metadata.scored_by ?? 0)}{" "}
              users)
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Popularity: </span>
              {metadata.popularity}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Aired: </span>
              {(metadata.aired as unknown as { string: string }).string}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Source: </span>
              {metadata.source}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Status: </span>
              {metadata.listStatus ?
                metadata.listStatus.status.charAt(0).toUpperCase() +
                metadata.listStatus.status.slice(1).replace(/_/g, " ")
              : "Not in list"}
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
              href={
                metadata.url ??
                `https://myanimelist.net/anime/${metadata.mal_id}`
              }
              target="_blank"
            >
              MyAnimeList
            </Link>
          </Button>
          <Credenza>
            <CredenzaTrigger asChild>
              <Button variant={"secondary"}>View Trailer</Button>
            </CredenzaTrigger>
            <CredenzaContent>
              <CredenzaHeader>
                <CredenzaTitle>Trailer - {metadata.title}</CredenzaTitle>
              </CredenzaHeader>
              <CredenzaBody>
                <iframe
                  className="aspect-video w-full"
                  src={metadata.trailer.embed_url}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </CredenzaBody>
            </CredenzaContent>
          </Credenza>
          <MyAnimeListButton metadata={metadata} />
        </div>
      </div>
    </div>
  );
};
