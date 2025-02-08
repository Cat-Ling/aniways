<script lang="ts">
	import { formatDuration, secondsToMilliseconds, secondsToMinutes } from 'date-fns';
	import type { PageProps } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '$lib/components/ui/dialog';
	import { getTrailer } from '$lib/api/anime';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data }: PageProps = $props();
	let anime = $derived(data.anime);

	let trailerOpen = $state(false);

	let trailer = $derived({
		trailer: anime.metadata?.trailer ?? getTrailer(anime.id).then((obj) => obj.trailer)
	});
</script>

<div class="mt-20 p-3 md:px-8">
	<div class="flex gap-8 rounded-md bg-card p-4">
		<div class="aspect-[3/4] w-1/4">
			<img
				src={anime.metadata?.mainPicture ?? anime.poster}
				alt={anime.jname}
				class="h-full w-full rounded-md bg-muted object-cover object-center"
			/>
		</div>
		<div class="flex w-full flex-col justify-between">
			<h1 class="font-sora text-2xl font-bold">{anime.jname}</h1>
			<h2 class="text-lg font-semibold text-muted-foreground">{anime.name}</h2>
			<div class="mt-2 flex gap-2">
				{@render pill(anime.metadata?.mediaType)}
				{@render pill(anime.metadata?.rating)}
				{@render pill(
					formatDuration({
						minutes: secondsToMinutes(anime.metadata?.avgEpDuration ?? 0)
					}) + ' per episode'
				)}
				{@render pill(anime.metadata?.airingStatus)}
			</div>
			<div class="mt-4 flex gap-4">
				<div>
					{@render keyValue('Total Episodes', anime.metadata?.totalEpisodes)}
					{@render keyValue('Studio', anime.metadata?.studio)}
					{@render keyValue('Rank', anime.metadata?.rank)}
					{@render keyValue(
						'Score',
						`${anime.metadata?.mean} (${anime.metadata?.scoringUsers} users)`
					)}
				</div>
				<div>
					{@render keyValue('Popularity', anime.metadata?.popularity)}
					{@render keyValue(
						'Airing',
						`${anime.metadata?.airingStart} - ${anime.metadata?.airingEnd ?? '???'}`
					)}
					{@render keyValue('Season', `${anime.metadata?.season} ${anime.metadata?.seasonYear}`)}
					{@render keyValue('Source', anime.metadata?.source?.replace('_', ' '))}
				</div>
			</div>
			<p class="mt-3 text-muted-foreground">{@html anime.metadata?.description}</p>
			<Dialog bind:open={trailerOpen}>
				<DialogTrigger asChild>
					<Button
						size="sm"
						class="mt-4 w-fit"
						onclick={() => {
							trailerOpen = true;
						}}
					>
						View Trailer
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>{anime.jname} Trailer</DialogTitle>
					{#await trailer.trailer}
						<Skeleton class="aspect-video w-full" />
					{:then trailer}
						<iframe
							title="{anime.jname} Trailer"
							class="aspect-video w-full"
							src={trailer}
							frameborder="0"
							allowfullscreen
						></iframe>
					{/await}
				</DialogContent>
			</Dialog>
			<div class="mt-4 flex flex-1 items-end gap-2">
				{#each anime.genre as genre}
					<Button
						variant="outline"
						size="sm"
						class="capitalize"
						href="/genre/{genre.toLowerCase().replace(' ', '-')}"
					>
						{genre}
					</Button>
				{/each}
			</div>
		</div>
	</div>
</div>

{#snippet pill(text: string | undefined | null)}
	{#if text}
		<span class="rounded-md bg-background p-2 text-sm text-primary">{text}</span>
	{/if}
{/snippet}

{#snippet keyValue(key: string, value: string | number | undefined | null)}
	{#if value}
		<div class="flex gap-2">
			<span class="font-sora font-semibold text-muted-foreground">{key}:</span>
			<span class="capitalize">{value}</span>
		</div>
	{/if}
{/snippet}
