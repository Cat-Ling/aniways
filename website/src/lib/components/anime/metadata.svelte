<script lang="ts">
	import { page } from '$app/state';
	import { getAnimeMetadata } from '$lib/api/anime';
	import { cn } from '$lib/utils';
	import { Info, PlayIcon, Plus, Tv } from 'lucide-svelte';
	import { Button } from '../ui/button';
	import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
	import Trailer from './trailer.svelte';

	type Props = {
		anime: Awaited<ReturnType<typeof getAnimeMetadata>>;
	};

	const { anime }: Props = $props();

	let isTrailerOpen = $state(false);
	let isDescriptionExpanded = $state(false);

	let animeDescriptionElement: HTMLElement | null = $state(null);
	let isDescriptionOverflow = $derived.by(() => {
		if (!animeDescriptionElement) return false;
		return animeDescriptionElement.scrollHeight > animeDescriptionElement.clientHeight;
	});

	let isWatchPage = $derived.by(() => page.url.pathname.includes('/watch'));
</script>

<div class={cn('p-3 md:px-8', isWatchPage ? 'mt-0' : 'relative z-20 -mt-48')}>
	<div class="flex flex-col gap-8 rounded-md bg-card p-4 md:flex-row">
		<div class="w-full md:w-1/4">
			{#key anime.picture}
				<img
					src={anime.picture}
					alt={anime.jname}
					class="aspect-[3/4] w-full rounded-md bg-muted object-cover object-center"
				/>
			{/key}
		</div>
		<div class="flex w-full flex-col justify-between">
			<div>
				<h1 class="font-sora text-2xl font-bold">{anime.jname}</h1>
				<h2 class="text-lg font-semibold text-muted-foreground">{anime.name}</h2>
				<div class="mt-2 hidden gap-2 md:flex">
					{@render pill(anime.mediaType)}
					{@render pill(anime.rating)}
					{@render pill(anime.avgEpDuration)}
					{@render pill(anime.airingStatus)}
				</div>
				<div class="mt-4 flex flex-col md:flex-row md:gap-4">
					<div>
						{@render keyValue('Total Episodes', anime.totalEpisodes)}
						{@render keyValue('Studio', anime.studio)}
						{@render keyValue('Rank', anime.rank)}
						{@render keyValue('Score', anime.score)}
					</div>
					<div>
						{@render keyValue('Popularity', anime.popularity)}
						{@render keyValue('Airing', anime.airing)}
						{@render keyValue('Season', anime.season)}
						{@render keyValue('Source', anime.source?.replace('_', ' '))}
					</div>
					<div class="md:hidden">
						{@render keyValue('Media Type', anime.mediaType)}
						{@render keyValue('Rating', anime.rating)}
						{@render keyValue('Avg Ep Duration', anime.avgEpDuration)}
						{@render keyValue('Airing Status', anime.airingStatus)}
					</div>
				</div>
				{#key anime.id}
					<p
						class={cn(
							'mt-3 text-muted-foreground',
							!isDescriptionExpanded && 'line-clamp-5 md:line-clamp-none'
						)}
						bind:this={animeDescriptionElement}
					>
						{@html anime.description}
					</p>
				{/key}
				{#if isDescriptionOverflow}
					<Button
						variant="secondary"
						class="mt-2 md:hidden"
						onclick={() => (isDescriptionExpanded = !isDescriptionExpanded)}
					>
						{isDescriptionExpanded ? 'Show Less' : 'Show More'}
					</Button>
				{/if}
			</div>
			<div class="flex flex-col justify-end">
				<div class="mt-4 grid grid-cols-2 items-center gap-2 md:flex">
					<Button href="/anime/{anime.id}" class={[isWatchPage || 'hidden']}>
						<Info class="mr-2" />
						Anime Details
					</Button>
					<Button href="/anime/{anime.id}/watch" class={[isWatchPage && 'hidden']}>
						<PlayIcon class="mr-2" />
						Watch Now
					</Button>
					<Button>
						<Plus class="mr-2" />
						Add to list
					</Button>
					<Dialog bind:open={isTrailerOpen}>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								onclick={() => {
									isTrailerOpen = true;
								}}
							>
								<Tv class="mr-2" />
								View Trailer
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle>{anime.jname} Trailer</DialogTitle>
							<Trailer animeId={anime.id} title={anime.jname} />
						</DialogContent>
					</Dialog>
				</div>
				<div class="mt-4 flex flex-1 flex-wrap items-end gap-2">
					{#each anime.genre as genre}
						<Button
							variant="outline"
							size="sm"
							class="capitalize"
							href="/genre/{genre.toLowerCase().replaceAll(' ', '-')}"
						>
							{genre}
						</Button>
					{/each}
				</div>
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
			<span class="font-semibold text-muted-foreground">{key}:</span>
			<span class="capitalize">{value}</span>
		</div>
	{/if}
{/snippet}
