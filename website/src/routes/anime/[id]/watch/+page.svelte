<script lang="ts">
	import { afterNavigate, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Metadata from '$lib/components/anime/metadata.svelte';
	import OtherAnimeSections from '$lib/components/anime/other-anime-sections.svelte';
	import Player from '$lib/components/anime/player.svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { cn } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	import type { Action } from 'svelte/action';
	import { type PageProps } from './$types';
	import { getSettings } from '$lib/context/settings';

	let props: PageProps = $props();
	let { query, data } = $derived(props.data);

	const settings = getSettings();

	let nextEpisodeUrl = $derived.by(() => {
		const currentIndex = data.episodes.findIndex((ep) => ep.id === query.key);
		const nextEpisode = data.episodes[currentIndex + 1];
		if (!nextEpisode) return;
		return `/anime/${query.id}/watch?episode=${nextEpisode.number}&key=${nextEpisode.id}`;
	});

	let episodeSearch = $state('');

	let episodes = $derived.by(() => {
		if (!episodeSearch) return data.episodes;
		return data.episodes
			.filter(
				(ep) =>
					ep.title?.toLowerCase().includes(episodeSearch.toLowerCase()) ||
					ep.number.toString().includes(episodeSearch)
			)
			.sort((a, b) => a.number - b.number);
	});

	afterNavigate(() => {
		episodeSearch = '';
	});

	onMount(async () => {
		await tick();
		const searchParams = page.url.searchParams;
		searchParams.set('episode', query.episode.toString());
		searchParams.set('key', query.key);
		searchParams.set('server', query.server);
		searchParams.set('type', query.type);
		replaceState(`/anime/${query.id}/watch?${searchParams.toString()}`, {});
	});

	const scrollToCurrentEpisode: Action<HTMLAnchorElement, boolean> = (
		node,
		isCurrentEp: boolean
	) => {
		$effect(() => {
			if (!isCurrentEp) return;
			node.scrollIntoView({ behavior: 'instant', block: 'center' });
		});
	};
</script>

<div class="mt-20 px-3 md:px-8">
	<div class="flex flex-col-reverse gap-2 md:flex-row">
		<div class="mt-3 flex w-full max-w-md flex-col gap-3 md:mt-0 md:w-1/5">
			<div class={'h-60 w-full overflow-scroll rounded-md bg-card md:h-full md:max-h-[512px]'}>
				<div class="sticky top-0 flex w-full items-center justify-between border-b bg-card p-3">
					<h3 class={'font-sora font-bold'}>Episodes</h3>
					<Input placeholder="Search episodes" class="w-1/2" bind:value={episodeSearch} />
				</div>
				{#each episodes as ep, i (ep.id + i)}
					<a
						data-sveltekit-noscroll
						href="/anime/{query.id}/watch?episode={ep.number}&key={ep.id}"
						class={cn(
							'flex items-center border-b border-border p-3 text-start transition last:border-b-0 hover:bg-muted',
							ep.number === query.episode && 'text-primary'
						)}
						use:scrollToCurrentEpisode={ep.number === query.episode}
					>
						<span class="mr-3 text-lg font-bold">
							{ep.number}
						</span>
						{ep.title}
					</a>
				{/each}
			</div>
			<div class="w-full flex-1 rounded-md bg-card">
				<h3 class="p-3 font-sora text-xl font-bold">Servers</h3>
				<p class="px-3 pb-3 text-sm text-muted-foreground">
					If the video doesn't load, please select another server.
				</p>
				{#each Object.entries(data.serversByType) as [type, servers]}
					<div class="grid grid-cols-5 items-center gap-2 p-3">
						{#if servers.length > 0}
							<h4 class="font-sora capitalize">{type}</h4>
						{/if}
						{#each servers as server}
							<Button
								href="/anime/{query.id}/watch?episode={query.episode}&key={query.key}&server={server.serverName}&type={type}"
								variant="outline"
								size="sm"
								class={cn(
									'col-span-2',
									server.serverName === query.server && type === query.type && 'border-primary'
								)}
								data-sveltekit-replacestate
							>
								{server.serverName}
							</Button>
						{/each}
					</div>
				{/each}
			</div>
		</div>
		<div class="aspect-video w-full flex-1 overflow-hidden rounded-md bg-card">
			{#await data.streamInfo}
				<Skeleton class="h-full w-full" />
			{:then info}
				<Player
					playerId="{query.id}-{query.episode}-{query.type}"
					settings={settings()}
					{nextEpisodeUrl}
					{info}
				/>
			{/await}
		</div>
	</div>
</div>

<Metadata anime={data.anime} />

<OtherAnimeSections animeId={query.id} seasonsAndRelatedAnimes={data.seasonsAndRelatedAnimes} />
