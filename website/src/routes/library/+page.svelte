<script lang="ts">
	import { goto } from '$app/navigation';
	import Empty from '$lib/assets/search.png';
	import AnimeGrid from '$lib/components/anime/anime-grid.svelte';
	import LibraryBtn from '$lib/components/anime/library-btn.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { RefreshCcw } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="mx-3 mb-3 mt-20 md:mx-8 md:mb-8">
	<h1 class="mb-3 font-sora text-2xl font-bold">Your Library</h1>
	<Button class="mb-3">
		<RefreshCcw />
		Sync with external
	</Button>

	<Tabs.Root
		value={data.status}
		onValueChange={(value) => {
			goto(`/library?status=${value}`);
		}}
	>
		<Tabs.List class="h-fit flex-wrap justify-center">
			<Tabs.Trigger value="all">All</Tabs.Trigger>
			<Tabs.Trigger value="watching">Watching</Tabs.Trigger>
			<Tabs.Trigger value="completed">Completed</Tabs.Trigger>
			<Tabs.Trigger value="paused">Paused</Tabs.Trigger>
			<Tabs.Trigger value="dropped">Dropped</Tabs.Trigger>
			<Tabs.Trigger value="planning">Planning</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value={data.status}>
			<AnimeGrid
				animes={data.library.items.map((item) => item.anime)}
				pageInfo={data.library.pageInfo}
				buildUrl={(anime) => `/anime/${anime.id}/watch`}
			>
				{#snippet subtitle({ anime, original })}
					<span class="flex flex-col">
						<span>
							<span class="capitalize">
								{data.library.items.find((item) => item.anime.id === anime.id)?.status}
							</span>
							{data.library.items.find((item) => item.anime.id === anime.id)?.watchedEpisodes} of {original}
						</span>
						<span class="absolute right-0 top-0 m-3 flex gap-2">
							<LibraryBtn
								mode="icon"
								animeId={anime.id}
								library={data.library.items.find((item) => item.anime.id === anime.id) ?? null}
							/>
						</span>
					</span>
				{/snippet}

				{#snippet emptyLayout()}
					<div class="flex flex-col items-center">
						<img
							src={Empty}
							alt="Empty"
							class="mb-6 w-48 overflow-hidden rounded-full border-2 border-border"
						/>
						<h2 class="font-sora font-bold">Your library is empty</h2>
						<p class="text-muted-foreground">Add an anime to your library</p>
					</div>
				{/snippet}
			</AnimeGrid>
		</Tabs.Content>
	</Tabs.Root>
</div>
