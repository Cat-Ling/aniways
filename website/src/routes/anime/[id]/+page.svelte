<script lang="ts">
	import { getTrailer } from '$lib/api/anime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '$lib/components/ui/dialog';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { formatDuration, secondsToMinutes } from 'date-fns';
	import { PlayIcon, Tv } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let anime = $derived(data.anime);
	let episodes = $derived(data.episodes);

	const formatter = Intl.NumberFormat('en-US');

	let trailerOpen = $state(false);

	let trailer = $derived({
		trailer:
			anime.metadata?.trailer ??
			getTrailer(fetch, anime.id)
				.then((obj) => obj.trailer)
				.catch(() => null)
	});
</script>

<div class="mt-20 p-3 md:px-8">
	<div class="flex gap-8 rounded-md bg-card p-4">
		<div class="w-1/4">
			<img
				src={anime.metadata?.mainPicture ?? anime.poster}
				alt={anime.jname}
				class="aspect-[3/4] w-full rounded-md bg-muted object-cover object-center"
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
						`${anime.metadata?.mean} (${formatter.format(anime.metadata?.scoringUsers ?? 0)} users)`
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
			<div class="mt-4 flex items-center gap-2">
				<Button href="/watch/{anime.id}?episode=1&key={episodes[0].id}">
					<PlayIcon class="mr-2" />
					Watch Now
				</Button>
				<Dialog bind:open={trailerOpen}>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							onclick={() => {
								trailerOpen = true;
							}}
						>
							<Tv class="mr-2" />
							View Trailer
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogTitle>{anime.jname} Trailer</DialogTitle>
						{#await trailer.trailer}
							<Skeleton class="aspect-video w-full" />
						{:then trailer}
							{#if trailer}
								<iframe
									title="{anime.jname} Trailer"
									class="aspect-video w-full"
									src={trailer}
									allow="autoplay"
									frameborder="0"
									allowfullscreen
								></iframe>
							{:else}
								<p>Oops! There is no trailer available for this anime. Please check back later.</p>
							{/if}
						{:catch}
							<p>Oops! There is no trailer available for this anime. Please check back later.</p>
						{/await}
					</DialogContent>
				</Dialog>
			</div>
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

<h2 class="mx-3 mt-8 font-sora text-xl font-bold md:mx-8">Episodes</h2>

<div class="mx-3 mt-4 grid grid-cols-1 gap-4 md:mx-8 md:grid-cols-2 lg:grid-cols-3">
	{#each episodes as episode}
		<Button
			variant="outline"
			class="h-fit flex-col items-start rounded-md bg-card p-3"
			href="/watch/{anime.id}?episode={episode.number}&key={episode.id}"
		>
			<p>
				Episode {episode.number}
			</p>
			<p class="w-full truncate font-sora text-muted-foreground">
				{episode.title === `Episode ${episode.number}` ? 'No title available' : episode.title}
			</p>
		</Button>
	{/each}
</div>

<h2 class="mx-3 mt-8 font-sora text-xl font-bold md:mx-8">Related Anime</h2>
<p class="mx-3 text-muted-foreground md:mx-8">TODO: Related Anime</p>

<h2 class="mx-3 mt-8 font-sora text-xl font-bold md:mx-8">Recommended Anime</h2>
<p class="mx-3 text-muted-foreground md:mx-8">TODO: Recommended Anime</p>

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
