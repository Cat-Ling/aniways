<script lang="ts">
	import { formatDuration, secondsToMilliseconds, secondsToMinutes } from 'date-fns';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let anime = $derived(data.anime);
</script>

<div class="mt-20 p-3 md:px-8">
	<div class="flex gap-8 rounded-md bg-card p-4">
		<img
			src={anime.metadata?.mainPicture ?? anime.poster}
			alt={anime.jname}
			class="aspect-[3/4] w-1/4 rounded-md object-cover object-center"
		/>
		<div class="w-full">
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
					{@render keyValue('Season', anime.metadata?.season)}
					{@render keyValue('Source', anime.metadata?.source?.replace('_', ' '))}
				</div>
			</div>
			<p class="mt-3 text-muted-foreground">{@html anime.metadata?.description}</p>
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
