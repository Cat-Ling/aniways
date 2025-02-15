<script lang="ts">
	import '@fontsource/open-sans';
	import '@fontsource/sora';
	import '../app.css';

	import { page } from '$app/state';
	import Navbar from '$lib/components/navigation/navbar.svelte';
	import SettingsSync from '$lib/components/settings/sync.svelte';
	import { setSettings, setUser } from '$lib/context/state.svelte';
	import { SvelteKitTopLoader } from 'sveltekit-top-loader';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const baseTitle = $derived(page.data?.title);
	const title = $derived(baseTitle ? `${baseTitle} | Aniways` : 'Aniways');

	if (data.user) setUser(data.user);
	if (data.settings) setSettings(data.settings);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<SvelteKitTopLoader color="hsl(var(--primary))" showSpinner={false} />
<Navbar />

{@render children()}

<SettingsSync />
