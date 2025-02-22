<script lang="ts">
	import { searchAnime } from '$lib/api/anime';
	import type { anime } from '$lib/api/anime/types';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import { appState } from '$lib/context/state.svelte';
	import { cn } from '$lib/utils';
	import { debounce } from 'lodash-es';
	import { Loader2, Search } from 'lucide-svelte';

	let value = $state('');

	let loading = $state(false);
	let animes: (typeof anime.infer)[] = $state([]);
	let hasMore = $state(false);

	const debouncedSearch = debounce((value: string, signal: AbortSignal) => {
		if (!value) return (loading = false), (animes = []);
		searchAnime(fetch, value, undefined, 1, 3, signal).then((res) => {
			animes = res.items;
			hasMore = res.pageInfo.hasNextPage;
			loading = false;
		});
	}, 500);

	$effect(() => {
		const controller = new AbortController();
		const signal = controller.signal;
		loading = true;
		hasMore = false;

		debouncedSearch(value, signal);

		return () => controller.abort();
	});
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === '/') appState.searchOpen = true;
		if (e.ctrlKey && e.key === 'k') appState.searchOpen = true;
	}}
/>

<Button
	variant="ghost"
	class="hidden rounded-full hover:bg-primary md:flex"
	size="icon"
	onclick={() => (appState.searchOpen = true)}
>
	<Search class="size-6" />
</Button>

<Button variant="ghost" class="rounded-full hover:bg-primary md:hidden" size="icon" href="/search">
	<Search class="size-6" />
</Button>

<Command.Dialog bind:open={appState.searchOpen} shouldFilter={false}>
	<Command.Input placeholder="Search for animes..." bind:value />
	<Command.List class="max-h-min">
		{#if loading}
			<Command.Loading class="flex items-center justify-center gap-2 p-2">
				<Loader2 class="animate-spin text-primary" />
				Loading...
			</Command.Loading>
		{:else if animes.length}
			<Command.Group heading="Search Results">
				{#each animes as anime (anime.id)}
					<Command.LinkItem href={`/anime/${anime.id}`} class="grid grid-cols-5 items-center gap-2">
						<div class="col-span-1 aspect-[300/400] overflow-hidden rounded-md bg-muted">
							<img
								src={anime.metadata?.mainPicture || anime.poster}
								alt={anime.name}
								class="h-full w-full rounded-md object-cover object-center"
							/>
						</div>
						<div class="col-span-4 flex h-full flex-col justify-center">
							<p class="line-clamp-1 font-bold">
								{@html anime.jname.replaceAll('"', "'")}
							</p>
							<p class="line-clamp-1 text-muted-foreground">
								{@html anime.name.replaceAll('"', "'")}
							</p>
							<p class="mt-3 text-sm">
								{anime.lastEpisode} episode{(anime.lastEpisode ?? 1) > 1 ? 's' : ''}
							</p>
						</div>
					</Command.LinkItem>
				{/each}
				{#if animes.length && hasMore}
					<Command.LinkItem href={`/search?q=${value}`} class="gap-2">
						{@html `See all results for <q>${value}</q>`}
					</Command.LinkItem>
				{/if}
			</Command.Group>
		{/if}
		<Command.Empty class={cn((loading || !value) && 'hidden')}>
			No results found for <q>{value}</q>
		</Command.Empty>
	</Command.List>
</Command.Dialog>
