<script lang="ts">
	import { afterNavigate, invalidate, replaceState } from '$app/navigation';
	import { saveToHistory, saveToLibrary } from '$lib/api/library';
	import Metadata from '$lib/components/anime/metadata.svelte';
	import OtherAnimeSections from '$lib/components/anime/other-anime-sections.svelte';
	import Player from '$lib/components/anime/player/index.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import { cn } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	import { type PageProps } from './$types';

	let props: PageProps = $props();
	let { query, data, episodes, anime, seasonsAndRelatedAnimes } = $derived(props.data);

	let nextEpisodeUrl = $derived.by(() => {
		const currentIndex = episodes.findIndex((ep) => ep.id === query.key);
		const nextEpisode = episodes[currentIndex + 1];
		if (!nextEpisode) return;
		return `/anime/${query.id}/watch?episode=${nextEpisode.number}&key=${nextEpisode.id}`;
	});

	afterNavigate(() => {
		const controller = new AbortController();
		saveToHistory(fetch, query.id, query.episode, controller.signal);
		return () => controller.abort();
	});

	onMount(async () => {
		await tick();
		const searchParams = new URLSearchParams({
			...query,
			episode: query.episode.toString()
		});
		searchParams.delete('id');
		replaceState(`/anime/${query.id}/watch?${searchParams.toString()}`, {});
	});

	onMount(() => {
		const currentEp = document.querySelector('[data-current]') as HTMLElement;
		if (!currentEp) return;
		const isMobile = window.matchMedia('(max-width: 768px)').matches;

		const position = isMobile ? 'nearest' : 'center';
		currentEp.scrollIntoView({ block: position, inline: position });
	});
</script>

<div class="mt-20 px-3 md:px-8">
	<div class="flex flex-col-reverse gap-2 md:flex-row">
		<div class="mt-3 flex w-full max-w-md flex-col-reverse gap-3 md:mt-0 md:w-1/5 md:flex-col">
			<Command.Root
				class={'h-60 w-full rounded-md bg-card md:h-full md:max-h-[512px]'}
				value={query.key}
			>
				<div
					class="flex w-full flex-col justify-between border-b bg-card px-3 pt-3 md:flex-row md:items-center md:pt-0"
				>
					<h3 class={'font-sora text-lg font-bold'}>Episodes</h3>
					<Command.Input placeholder="Search episodes" containerClass="border-none" />
				</div>
				<Command.List class="h-fit max-h-full">
					{#each episodes as ep, i (ep.id + i)}
						<Command.LinkItem
							data-current={ep.number === query.episode || undefined}
							data-sveltekit-noscroll
							href="/anime/{query.id}/watch?episode={ep.number}&key={ep.id}"
							class={cn(
								'flex cursor-pointer items-center p-3 text-start transition hover:bg-muted',
								ep.number === query.episode && '!text-primary'
							)}
						>
							<span class="mr-3 text-lg font-bold">
								{ep.number}
							</span>
							{ep.title}
						</Command.LinkItem>
						{#if i !== episodes.length - 1}
							<Command.Separator />
						{/if}
					{/each}
				</Command.List>
			</Command.Root>
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
			<Player
				{nextEpisodeUrl}
				info={data.streamInfo}
				playerId="{query.id}-{query.episode}-{query.type}"
				updateLibrary={async () => {
					if (props.data.library && query.episode <= props.data.library?.watchedEpisodes) return;
					await saveToLibrary(fetch, query.id, 'watching', query.episode);
					await invalidate((url) => url.pathname.includes('library'));
				}}
			/>
		</div>
	</div>
</div>

<Metadata {anime} library={props.data.library} />

<OtherAnimeSections animeId={query.id} {seasonsAndRelatedAnimes} />
