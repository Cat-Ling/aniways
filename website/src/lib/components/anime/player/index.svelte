<script lang="ts">
	import { invalidate, preloadData } from '$app/navigation';
	import type { streamInfo } from '$lib/api/anime/types';
	import { saveToLibrary } from '$lib/api/library';
	import { createArtPlayer } from '$lib/components/anime/player/create-player.svelte';
	import { appState } from '$lib/context/state.svelte';
	import { metadataState } from '../library-state.svelte';

	type Props = {
		animeId: string;
		currentEpisode: number;
		playerId: string;
		info: typeof streamInfo.infer;
		nextEpisodeUrl?: string;
	};

	let { info, playerId, nextEpisodeUrl, animeId, currentEpisode }: Props = $props();

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
			nextEpisodeUrl,
			updateLibrary: () => {
				if (metadataState.library && currentEpisode <= metadataState.library.watchedEpisodes) {
					return;
				}
				saveToLibrary(fetch, animeId, 'watching', currentEpisode);
				metadataState.library = {
					...metadataState.library,
					status: 'watching',
					watchedEpisodes: currentEpisode
				} as never;
			}
		});

		return async () => {
			(await player).destroy();
		};
	});
</script>

<div class="h-full w-full bg-card" bind:this={element}></div>
