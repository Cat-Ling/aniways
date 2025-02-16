<script lang="ts">
	import { preloadData } from '$app/navigation';
	import type { streamInfo } from '$lib/api/anime/types';
	import { createArtPlayer } from '$lib/components/anime/player/create-player.svelte';
	import { appState } from '$lib/context/state.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		playerId: string;
		info: typeof streamInfo.infer;
		nextEpisodeUrl?: string;
	};

	let { info, playerId, nextEpisodeUrl }: Props = $props();

	let element: HTMLDivElement | null = $state(null);

	$effect(() => {
		if (!nextEpisodeUrl || appState.settings.autoNextEpisode) return;
		preloadData(nextEpisodeUrl);
	});

	$effect(() => {
		if (!element) return;

		const player = createArtPlayer({
			id: playerId,
			container: element,
			source: info,
			nextEpisodeUrl
		});

		return async () => {
			(await player).destroy();
		};
	});
</script>

<div class="h-full w-full bg-card" bind:this={element}></div>
