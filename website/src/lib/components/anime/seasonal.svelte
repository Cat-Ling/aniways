<script lang="ts">
	import type { anilistAnime } from '$lib/api/anime/types';
	import * as Carousel from '$lib/components/ui/carousel';

	type Props = {
		seasonalAnimes: (typeof anilistAnime.infer)[];
	};

	const { seasonalAnimes }: Props = $props();
</script>

<Carousel.Root>
	<Carousel.Content class="m-0 max-h-[75vh] max-w-full p-0">
		{#each seasonalAnimes as anime}
			<Carousel.Item class="relative aspect-video w-full">
				<div
					class="absolute left-0 top-0 h-full w-full bg-gradient-to-l from-transparent via-background/90 to-background"
				></div>
				<img
					src={anime.bannerImage}
					alt={anime.title}
					class="h-full w-full object-cover object-center"
				/>
				<div class="absolute bottom-0 left-0 p-4">
					<h2 class="text-2xl font-bold">{anime.title}</h2>
					<p class="text-lg">{new Date(anime.startDate)}</p>
				</div>
			</Carousel.Item>
		{/each}
		<Carousel.Next />
		<Carousel.Previous />
	</Carousel.Content>
</Carousel.Root>
