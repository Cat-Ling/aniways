<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import AnimeGrid from '$lib/components/anime/anime-grid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let sectionElment = $state<HTMLElement | null>(null);
	let isPageNavigation = $state(false);

	afterNavigate(() => {
		if (sectionElment && isPageNavigation) {
			sectionElment.scrollIntoView({ behavior: 'instant', block: 'start' });
			isPageNavigation = false;
		}
	});
</script>

<section bind:this={sectionElment} class="-mt-24 w-full pt-24">
	<h1 class="relative z-30 font-sora text-2xl font-bold">Recently Updated Anime</h1>
	<AnimeGrid
		animes={data.recentlyUpdated.items}
		pageInfo={data.recentlyUpdated.pageInfo}
		buildUrl={(anime) => `/watch/${anime.id}?episode=${anime.lastEpisode}`}
		onPaginationClick={() => (isPageNavigation = true)}
	/>
</section>
