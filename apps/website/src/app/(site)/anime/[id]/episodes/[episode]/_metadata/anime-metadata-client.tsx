"use client";

import { Suspense } from "react";
import Link from "next/link";

import { Image } from "@aniways/ui/aniways-image";
import { Button } from "@aniways/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@aniways/ui/dialog";
import { Skeleton } from "@aniways/ui/skeleton";

import { AnimeChooser } from "./_anime-chooser";
import { MyAnimeListButton } from "./_myanimelist-button";
import { useMetadata } from "./metadata-provider";

interface AnimeMetadataClientProps {
	anime: {
		title: string;
	};
}

export const AnimeMetadataClient = ({ anime }: AnimeMetadataClientProps) => {
	const [details] = useMetadata();

	return (
		<div className="mb-6 grid min-h-[400px] w-full grid-cols-1 gap-6 md:grid-cols-4">
			<Image
				src={details.images.jpg.large_image_url}
				alt={anime.title}
				width={300}
				height={400}
				className="w-full rounded-md border border-border object-cover"
			/>
			<div className="flex flex-col gap-3 md:col-span-3">
				<div>
					<h2 className="text-2xl font-bold">{details.title}</h2>
					<p className="text-sm text-muted-foreground">
						{details.title_english}
					</p>
					<div className="mt-2 flex flex-col justify-start gap-3 md:flex-row">
						{[
							details.type,
							details.rating,
							`${details.season?.replace(/^\w/, (c) => c.toUpperCase())} ${details.year}`,
							details.duration,
							details.status,
						].map(
							(info, index) =>
								info && (
									<div
										key={index}
										className="rounded-md bg-muted p-2 text-sm text-primary"
									>
										{info}
									</div>
								),
						)}
					</div>
					<div className="mt-2 grid w-full grid-cols-2 md:w-1/2">
						<div className="text-sm">
							<span className="text-muted-foreground">Genres: </span>
							{details.genres.map((genre) => genre.name).join(", ")}
						</div>
						<div className="text-sm">
							<span className="text-muted-foreground">Total Episodes: </span>
							{details.episodes ?? "???"}
						</div>
						<div className="text-sm">
							<span className="text-muted-foreground">Studios: </span>
							{details.studios.map((studio) => studio.name).join(", ")}
						</div>
						<div className="text-sm">
							<span className="text-muted-foreground">Rank: </span>
							{details.rank}
						</div>
						<div className="text-sm">
							<span className="text-muted-foreground">Score: </span>
							<span className="font-bold">
								{Intl.NumberFormat("en-US", {
									minimumSignificantDigits: 3,
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
								}).format(details.score ?? 0)}
							</span>{" "}
							({Intl.NumberFormat("en-US").format(details.scored_by ?? 0)}{" "}
							users)
						</div>
						<div className="text-sm">
							<span className="text-muted-foreground">Popularity: </span>
							{details.popularity}
						</div>
						<div className="text-sm">
							<span className="text-muted-foreground">Aired: </span>
							{(details.aired as unknown as { string: string }).string}
						</div>
						<div className="text-sm">
							<span className="text-muted-foreground">Source: </span>
							{details.source}
						</div>
						<div className="text-sm">
							<span className="text-muted-foreground">Status: </span>
							{details.listStatus
								? details.listStatus.status.charAt(0).toUpperCase() +
									details.listStatus.status.slice(1).replace(/_/g, " ")
								: "Not in list"}
						</div>
						<div className="text-sm">
							<span className="text-muted-foreground">Watched Episodes: </span>
							{details.listStatus?.num_episodes_watched ?? 0}
						</div>
					</div>
				</div>
				<p className="text-sm text-muted-foreground">{details.synopsis}</p>
				<div className="flex flex-col gap-2 md:flex-row">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant={"secondary"}>Report Wrong Information</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle>Report Wrong Information</DialogTitle>
							<DialogDescription>Choose the correct Anime</DialogDescription>
							<Suspense fallback={<Skeleton className="h-[480px] w-full" />}>
								<AnimeChooser query={anime.title} />
							</Suspense>
						</DialogContent>
					</Dialog>
					<Button variant={"secondary"} asChild>
						<Link
							className="w-full md:w-fit"
							href={
								details.url ?? `https://myanimelist.net/anime/${details.mal_id}`
							}
							target="_blank"
						>
							MyAnimeList
						</Link>
					</Button>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant={"secondary"}>View Trailer</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle>Trailer - {details.title}</DialogTitle>
							<iframe
								className="aspect-video w-full"
								src={details.trailer.embed_url}
								title="YouTube video player"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
						</DialogContent>
					</Dialog>
					<MyAnimeListButton details={details} />
				</div>
			</div>
		</div>
	);
};
