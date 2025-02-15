<script lang="ts">
	import { goto } from '$app/navigation';
	import { searchAnime } from '$lib/api/anime';
	import type { anime } from '$lib/api/anime/types';
	import * as Command from '$lib/components/ui/command';
	import { appState } from '$lib/context/state.svelte';
	import { debounce } from 'lodash-es';
	import Search from 'lucide-svelte/icons/search';
	import { Button } from '../ui/button';

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
	on:click={() => (appState.searchOpen = true)}
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
			<Command.Loading class="p-2">Loading...</Command.Loading>
		{:else if !value}
			<Command.Empty>Type to search for animes</Command.Empty>
		{:else}
			<Command.Group heading="Search Results">
				{#each animes as anime (anime.id)}
					<Command.Item
						onSelect={() => (goto(`/anime/${anime.id}`), (appState.searchOpen = false))}
						class="gap-2"
					>
						<img src={anime.poster} alt={anime.name} class="aspect-[300/400] w-1/5 rounded" />
						<div class="h-full">
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
					</Command.Item>
				{/each}
				{#if animes.length && hasMore}
					<Command.Item
						onSelect={() => (goto(`/search?q=${value}`), (appState.searchOpen = false))}
						class="gap-2"
					>
						{@html `See all results for <q>${value}</q>`}
					</Command.Item>
				{/if}
			</Command.Group>
			{#if !animes.length}
				<Command.Empty>No results found for <q>{value}</q></Command.Empty>
			{/if}
		{/if}
	</Command.List>
</Command.Dialog>
