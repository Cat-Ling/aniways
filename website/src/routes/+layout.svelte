<script lang="ts">
	import '../app.css';
	import '@fontsource/open-sans';
	import '@fontsource/sora';

	import Navbar from '$lib/components/navigation/navbar.svelte';
	import { SvelteKitTopLoader } from 'sveltekit-top-loader';

	import { page } from '$app/state';

	let { children } = $props();

	const baseTitle = $derived(page.data?.title);
	const title = $derived(baseTitle ? `${baseTitle} | Aniways` : 'Aniways');
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<SvelteKitTopLoader color="hsl(346.8 77.2% 49.8%)" showSpinner={false} />
<Navbar />

{@render children()}
