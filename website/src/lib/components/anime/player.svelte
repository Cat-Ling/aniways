<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import type { streamInfo } from '$lib/api/anime/types';
	import type { settings as settingsSchema } from '$lib/api/settings/types';
	import { createArtPlayer } from '$lib/player';
	import { cn } from '$lib/utils';
	import { Skeleton } from '../ui/skeleton';

	type Props = {
		playerId: string;
		info: typeof streamInfo.infer;
		settings: typeof settingsSchema.infer;
		nextEpisodeUrl?: string;
	};

	let { info, settings, playerId, nextEpisodeUrl }: Props = $props();

	let element: HTMLDivElement | null = $state(null);
	let isLoading = $state(true);

	$effect(() => {
		if (!nextEpisodeUrl || !settings.autoNextEpisode) return;
		preloadData(nextEpisodeUrl);
	});

	$effect(() => {
		if (!element) return;

		isLoading = true;
		const player = createArtPlayer({
			id: playerId,
			container: element,
			source: info,
			onReady: (art) => {
				isLoading = false;
				if (settings.autoPlayEpisode) {
					art.play();
				}
			},
			onEnded: () => {
				if (!settings.autoNextEpisode || !nextEpisodeUrl) return;
				goto(nextEpisodeUrl);
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
