<script lang="ts">
  import '@fontsource/open-sans';
  import '@fontsource/sora';
  import '../app.css';

  import { page } from '$app/state';
  import Footer from '$lib/components/navigation/footer.svelte';
  import Navbar from '$lib/components/navigation/navbar.svelte';
  import SettingsSync from '$lib/components/settings/sync.svelte';
  import { Toaster } from '$lib/components/ui/sonner';
  import { setSettings, setUser } from '$lib/context/state.svelte';
  import { SvelteKitTopLoader } from 'sveltekit-top-loader';
  import type { LayoutProps } from './$types';

  let { children, data }: LayoutProps = $props();

  const baseTitle = $derived(page.data?.title);
  const title = $derived(baseTitle ? `${baseTitle} | Aniways` : 'Aniways');

  $effect(() => {
    setUser(data.user);
    setSettings(data.settings);
  });
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<SvelteKitTopLoader color="hsl(var(--primary))" showSpinner={false} />
<Navbar user={data.user} />

<div class="min-h-screen">
  {@render children()}
</div>

<Toaster richColors />

<Footer
  genres={data.genres.map((genre) => ({
    value: genre,
    label: genre
      .split('-')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }))}
/>

<SettingsSync />
