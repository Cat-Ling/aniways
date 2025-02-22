<script lang="ts">
	import { page } from '$app/state';
	import { getAnimeMetadata } from '$lib/api/anime';
	import type { libraryItemSchema } from '$lib/api/library/types';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils';
	import { Info, PlayIcon, Tv } from 'lucide-svelte';
	import LibraryBtn from './library-btn.svelte';
	import Trailer from './trailer.svelte';

	type Props = {
		anime: Awaited<ReturnType<typeof getAnimeMetadata>>;
		library: typeof libraryItemSchema.infer | null;
	};

	const { anime, library }: Props = $props();

	let isTrailerOpen = $state(false);
	let isDescriptionExpanded = $state(false);

	let animeDescriptionElement: HTMLElement | null = $state(null);
	let isDescriptionOverflow = $derived.by(() => {
		if (!animeDescriptionElement) return false;
		return animeDescriptionElement.scrollHeight > animeDescriptionElement.clientHeight;
	});

	let isWatchPage = $derived.by(() => page.url.pathname.includes('/watch'));
</script>

<div class={cn('p-3 md:px-8', isWatchPage ? 'mt-0' : 'relative z-20 -mt-12 md:-mt-24')}>
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
					{@render pill(anime.airingStatus)}
				</div>
				<div class="mt-2 flex flex-1 flex-wrap items-end gap-2">
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
				<div class="mt-2 flex flex-col md:flex-row md:gap-4">
					<div>
						{@render keyValue('Total Episodes', anime.totalEpisodes)}
						{@render keyValue('Studio', anime.studio)}
						{@render keyValue('Rank', anime.rank)}
						{@render keyValue('Score', anime.score)}
						{@render keyValue('Avg Ep Duration', anime.avgEpDuration)}
					</div>
					<div>
						{@render keyValue('Popularity', anime.popularity)}
						{@render keyValue('Airing', anime.airing)}
						{@render keyValue('Season', anime.season)}
						{@render keyValue('Source', anime.source?.replace('_', ' '))}
						<span class="hidden md:inline">
							{@render keyValue(
								'Library',
								library ? `${library?.status} (${library?.watchedEpisodes} eps)` : 'Not in Library'
							)}
						</span>
					</div>
					<div class="md:hidden">
						{@render keyValue('Media Type', anime.mediaType)}
						{@render keyValue('Rating', anime.rating)}
						{@render keyValue('Airing Status', anime.airingStatus)}
						{@render keyValue('Library', `${library?.status} (${library?.watchedEpisodes} eps)`)}
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
						class="mt-2 w-full md:hidden"
						onclick={() => (isDescriptionExpanded = !isDescriptionExpanded)}
					>
						{isDescriptionExpanded ? 'Show Less' : 'Show More'}
					</Button>
				{/if}
			</div>
			<div class="flex flex-col justify-end">
				<div class="mt-4 grid grid-cols-2 items-center gap-2 md:flex">
					<Button href="/anime/{anime.id}" class={[isWatchPage || 'hidden']}>
						<Info />
						View Details
					</Button>
					<Button href="/anime/{anime.id}/watch" class={[isWatchPage && 'hidden']}>
						<PlayIcon />
						Watch Now
					</Button>
					<LibraryBtn animeId={anime.id} {library} />
					<Dialog bind:open={isTrailerOpen}>
						<DialogTrigger
							class={buttonVariants({ variant: 'outline', class: 'col-span-2' })}
							onclick={() => (isTrailerOpen = true)}
						>
							<Tv />
							View Trailer
						</DialogTrigger>
						<DialogContent>
							<DialogTitle>{anime.jname} Trailer</DialogTitle>
							<Trailer animeId={anime.id} title={anime.jname} />
						</DialogContent>
					</Dialog>
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
	<div class="flex gap-2">
		<span class="font-semibold text-muted-foreground">{key}:</span>
		<span class="capitalize">{value || '???'}</span>
	</div>
{/snippet}
