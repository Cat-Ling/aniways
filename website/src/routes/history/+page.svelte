<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { deleteFromHistory } from '$lib/api/library';
	import AnimeGrid from '$lib/components/anime/anime-grid.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { TrashIcon } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="mt-20 px-3 pb-3 md:px-8 md:pb-8">
	<h1 class="font-sora text-2xl font-bold">History</h1>
	<p class="mt-2 font-sora text-muted-foreground">
		All the history of anime you have watched will be displayed here.
	</p>
	<AnimeGrid
		animes={data.history.items.map((item) => item.anime)}
		pageInfo={data.history.pageInfo}
		buildUrl={(anime) => {
			const historyItem = data.history.items.find((item) => item.anime.id === anime.id);
			return `/anime/${anime.id}/watch?episode=${historyItem?.watchedEpisodes ?? 1}`;
		}}
	>
		{#snippet subtitle({ anime, original })}
			<span class="flex flex-col gap-4">
				<span>
					{data.history.items.find((item) => item.anime.id === anime.id)?.watchedEpisodes} of {original}
				</span>
				<Button
					class="absolute right-0 top-0 m-3 w-fit"
					onclick={async (e) => {
						e.preventDefault();
						e.stopPropagation();
						e.stopImmediatePropagation();
						await deleteFromHistory(fetch, anime.id);
						await invalidate((url) => url.pathname === '/library/history');
					}}
				>
					<TrashIcon />
				</Button>
			</span>
		{/snippet}
	</AnimeGrid>
</div>
