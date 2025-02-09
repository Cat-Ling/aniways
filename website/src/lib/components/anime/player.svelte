<script lang="ts">
	import type { streamInfo } from '$lib/api/anime/types';
	import { createArtPlayer } from '$lib/player';
	import { cn } from '$lib/utils';
	import type Artplayer from 'artplayer';
	import { Skeleton } from '../ui/skeleton';

	type Props = {
		info: typeof streamInfo.infer;
		onError: (art: Artplayer) => void;
	};

	let { info, onError }: Props = $props();

	let element: HTMLDivElement | null = $state(null);
	let isLoading = $state(true);

	$effect(() => {
		if (!element) return;

		isLoading = true;
		const player = createArtPlayer({
			container: element,
			source: info,
			onError
		}).then((player) => {
			isLoading = false;
			return player;
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
