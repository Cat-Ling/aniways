<script lang="ts">
	import { afterNavigate, goto, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Metadata from '$lib/components/anime/metadata.svelte';
	import OtherAnimeSections from '$lib/components/anime/other-anime-sections.svelte';
	import Player from '$lib/components/anime/player.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { cn } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	import type { Action } from 'svelte/action';
	import { type PageProps } from './$types';

	let props: PageProps = $props();
	let { query, data } = $derived(props.data);

	let streamInfo = $derived(data.streamInfo);
	let nextServer = $derived.by(() => {
		const servers = data.serversByType[query.type];
		const index = servers.findIndex((server) => server.serverName === query.server);
		return servers[index + 1]?.serverName;
	});
	let moveToNextServer = $state(false);

	$effect(() => {
		if (!moveToNextServer) return;
		if (!nextServer) return;
		if (nextServer === query.server) return;
		window.history.replaceState(
			null,
			'',
			`/watch/${query.id}?episode=${query.episode}&key=${query.key}&server=${query.type}_${nextServer}`
		);
		window.location.reload();
	});

	afterNavigate(() => {
		moveToNextServer = false;
	});

	onMount(async () => {
		await tick();
		const searchParams = page.url.searchParams;
		searchParams.set('episode', query.episode.toString());
		searchParams.set('key', query.key);
		searchParams.set('server', `${query.type}_${query.server}`);
		replaceState(`/watch/${query.id}?${searchParams.toString()}`, {});
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
			<div class="rounded-md bg-card p-3 md:hidden">
				<h3 class="mb-3 font-sora text-xl font-bold">Episodes</h3>
				<Dialog.Root>
					<Dialog.Trigger
						class={buttonVariants({
							variant: 'outline',
							className: 'w-full justify-start text-start'
						})}
					>
						<p class="w-full truncate">
							<span class="mr-1 font-sora text-muted-foreground">{query.episode}</span>
							-
							<span class="ml-1">
								{data.episodes.find((ep) => ep.number === query.episode)?.title}
								{data.episodes.find((ep) => ep.number === query.episode)?.title}
							</span>
						</p>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Title>Select Episode</Dialog.Title>
						<div class="max-h-[512px] overflow-scroll">
							{#each data.episodes as ep, i (ep.id + i)}
								<Dialog.Close
									class={cn(
										'flex w-full items-center border-b border-border p-3 text-start transition last:border-b-0 hover:bg-muted',
										ep.number === query.episode && 'text-primary'
									)}
									onclick={() => {
										goto(`/watch/${query.id}?episode=${ep.number}&key=${ep.id}`);
									}}
								>
									<span class="mr-3 min-w-7 text-lg font-bold">
										{ep.number}
									</span>
									<span class="flex-1 text-start">
										{ep.title}
									</span>
								</Dialog.Close>
							{/each}
						</div>
					</Dialog.Content>
				</Dialog.Root>
			</div>
			<div class={'hidden h-full max-h-[512px] w-full overflow-scroll rounded-md bg-card md:block'}>
				<h3 class={'sticky top-0 w-full border-b bg-card p-3 font-sora font-bold'}>Episodes</h3>
				{#each data.episodes as ep, i (ep.id + i)}
					<a
						href="/watch/{query.id}?episode={ep.number}&key={ep.id}"
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
				{#each Object.entries(data.serversByType) as [type, servers]}
					<div class="grid grid-cols-5 items-center gap-2 p-3">
						{#if servers.length > 0}
							<h4 class="font-sora capitalize">{type}</h4>
						{/if}
						{#each servers as server}
							<Button
								href="/watch/{query.id}?episode={query.episode}&key={query.key}&server={`${type}_${server.serverName}`}"
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
			{#await streamInfo}
				<Skeleton class="h-full w-full" />
			{:then info}
				<Player {info} />
			{/await}
		</div>
	</div>
</div>

<Metadata anime={data.anime} />

<OtherAnimeSections animeId={query.id} seasonsAndRelatedAnimes={data.otherAnimeSections} />
