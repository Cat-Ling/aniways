<script lang="ts">
	import { preloadData } from '$app/navigation';
	import type { streamInfo } from '$lib/api/anime/types';
	import { createArtPlayer } from '$lib/components/anime/player/create-player.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { appState } from '$lib/context/state.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		playerId: string;
		info: typeof streamInfo.infer;
		nextEpisodeUrl?: string;
	};

	let { info, playerId, nextEpisodeUrl }: Props = $props();

	let element: HTMLDivElement | null = $state(null);
	let isLoading = $state(true);

	$effect(() => {
		if (!nextEpisodeUrl || appState.settings.autoNextEpisode) return;
		preloadData(nextEpisodeUrl);
	});

	$effect(() => {
		if (!element) return;

		isLoading = true;
		const player = createArtPlayer({
			id: playerId,
			container: element,
			source: info,
			nextEpisodeUrl,
			setIsLoading: (loading) => {
				isLoading = loading;
			}
		});

		return async () => {
			(await player).destroy();
		};
	});
</script>

{#if isLoading}
	<Skeleton class="h-full w-full" />
{/if}

<div class={cn('h-full w-full bg-card', isLoading && 'hidden')} bind:this={element}></div>
