<script lang="ts">
	import '../app.css';
	import '@fontsource/open-sans';
	import '@fontsource/sora';

	import Navbar from '$lib/components/navigation/navbar.svelte';

	import { page } from '$app/state';

	let { children } = $props();

	const baseTitle = $derived(page.data?.title);
	const title = $derived(baseTitle ? `${baseTitle} | Aniways` : 'Aniways');
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<Navbar />

{@render children()}
