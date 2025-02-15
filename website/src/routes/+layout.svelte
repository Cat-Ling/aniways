<script lang="ts">
	import '@fontsource/open-sans';
	import '@fontsource/sora';
	import '../app.css';

	import { page } from '$app/state';
	import Footer from '$lib/components/navigation/footer.svelte';
	import Navbar from '$lib/components/navigation/navbar.svelte';
	import SettingsSync from '$lib/components/settings/sync.svelte';
	import { appState, setSettings, setUser } from '$lib/context/state.svelte';
	import { SvelteKitTopLoader } from 'sveltekit-top-loader';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const baseTitle = $derived(page.data?.title);
	const title = $derived(baseTitle ? `${baseTitle} | Aniways` : 'Aniways');

	appState.isLoading = true;
	Promise.all([data.settings, data.user]).then(([settings, user]) => {
		if (settings) setSettings(settings);
		if (user) setUser(user);
		appState.isLoading = false;
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<SvelteKitTopLoader color="hsl(var(--primary))" showSpinner={false} />
<Navbar />

{@render children()}

<SettingsSync />

<Footer
	genres={data.genres.map((genre) => ({
		value: genre,
		label: genre
			.split('-')
			.map((word) => word[0].toUpperCase() + word.slice(1))
			.join(' ')
	}))}
/>
