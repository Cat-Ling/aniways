<script lang="ts">
	import '../app.css';

	import { page } from '$app/state';

	let { children } = $props();

	const baseTitle = $derived(page.data?.title);
	const title = $derived(baseTitle ? `${baseTitle} | Aniways` : 'Aniways');
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

{@render children()}
