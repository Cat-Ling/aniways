<script lang="ts">
	import type { streamInfo } from '$lib/api/anime/types';
	import { createArtPlayer } from '$lib/player';
	import { cn } from '$lib/utils';
	import { Skeleton } from '../ui/skeleton';

	type Props = {
		info: typeof streamInfo.infer;
	};

	let { info }: Props = $props();

	let element: HTMLDivElement | null = $state(null);
	let isLoading = $state(true);

	$effect(() => {
		if (!element) return;

		isLoading = true;
		const player = createArtPlayer({
			container: element,
			source: info
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

<div class={cn('g-card h-full w-full', isLoading && 'hidden')} bind:this={element}></div>
