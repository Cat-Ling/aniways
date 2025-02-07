<script lang="ts">
	import Seasonal from '$lib/components/anime/seasonal.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const seasonalAnimes = data?.seasonalAnime;
</script>

<Seasonal {seasonalAnimes} />

{@render children()}
