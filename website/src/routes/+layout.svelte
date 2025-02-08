<script lang="ts">
	import '@fontsource/open-sans';
	import '@fontsource/sora';
	import '../app.css';

	import { page } from '$app/state';
	import Navbar from '$lib/components/navigation/navbar.svelte';
	import { setUser } from '$lib/context/user';
	import { SvelteKitTopLoader } from 'sveltekit-top-loader';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const baseTitle = $derived(page.data?.title);
	const title = $derived(baseTitle ? `${baseTitle} | Aniways` : 'Aniways');

	if (data.user) setUser(data.user);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<SvelteKitTopLoader color="hsl(346.8 77.2% 49.8%)" showSpinner={false} />
<Navbar />

{@render children()}
