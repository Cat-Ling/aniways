<script lang="ts">
	import type { streamInfo } from '$lib/api/anime/types';
	import { createArtPlayer } from '$lib/player';

	type Props = {
		info: typeof streamInfo.infer;
	};

	let { info }: Props = $props();

	let element: HTMLDivElement | null = $state(null);

	$effect(() => {
		if (!element) return;

		const player = createArtPlayer({
			container: element,
			source: info
		});

		return async () => {
			(await player).destroy();
		};
	});
</script>

<div class="h-full w-full bg-card" bind:this={element}></div>
