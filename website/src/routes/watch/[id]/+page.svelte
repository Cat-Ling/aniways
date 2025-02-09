<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { type PageProps } from './$types';

	let { data }: PageProps = $props();

	onMount(() => {
		const searchParams = page.url.searchParams;
		searchParams.set('episode', data.query.episode.toString());
		searchParams.set('key', data.query.key);
		searchParams.set('server', data.query.server);
		replaceState(`/watch/${data.query.id}?${searchParams.toString()}`, {});
	});
</script>

<h1 class="mt-20">Watch</h1>
<pre>{JSON.stringify(data.data, null, 2)}</pre>
