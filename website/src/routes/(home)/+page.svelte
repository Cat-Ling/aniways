<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	const p = $derived(Number(page.url.searchParams.get('page') || 1));
</script>

<main>
	<h1>Recently released section</h1>
	<p>Page: {p}</p>
	<Button href="?page={p + 1}">Next page</Button>
	<Button href="?page={p - 1}">Previous page</Button>
	<Button href="?page=1">First page</Button>
</main>
