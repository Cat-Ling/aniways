<script lang="ts">
	import { getTrailer } from '$lib/api/anime';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	type Props = {
		title: string;
		animeId: string;
	};

	let { title, animeId }: Props = $props();

	let trailer = $state('');
	let isLoading = $state(true);

	$effect(() => {
		isLoading = true;

		const abortController = new AbortController();
		const { signal } = abortController;

		getTrailer(fetch, animeId, signal)
			.then((data) => {
				trailer = data.trailer;
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				isLoading = false;
			});

		return () => {
			abortController.abort();
		};
	});
</script>

{#if isLoading}
	<Skeleton class="aspect-video w-full" />
{:else if trailer}
	<iframe
		{title}
		class="aspect-video w-full"
		src={trailer}
		allow="autoplay"
		frameborder="0"
		allowfullscreen
	></iframe>
{:else}
	<p>Oops! There is no trailer available for this anime. Please check back later.</p>
{/if}
