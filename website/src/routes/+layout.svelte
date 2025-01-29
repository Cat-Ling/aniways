<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Aniways</title>
</svelte:head>

{@render children()}
