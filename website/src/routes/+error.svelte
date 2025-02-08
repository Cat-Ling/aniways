<script lang="ts">
	import sorry from '$lib/assets/sorry.png?enhanced';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import { ChevronLeft, Home } from 'lucide-svelte';

	let is404 = $derived(page.status === 404);
</script>

<div class="mx-auto mt-32 flex w-1/2 flex-col gap-4">
	<enhanced:img
		src={sorry}
		alt="Sorry, this page does not exist"
		class="mx-auto w-full max-w-screen-md"
	/>
	{#if is404}
		<h1 class="text-center font-sora text-2xl">Sorry, this page does not exist</h1>
		<p class="text-center">
			The page you are looking for does not exist. Please check the URL and try again.
		</p>
	{:else}
		<h1 class="text-center font-sora text-2xl">Sorry, something went wrong</h1>
		<p class="text-center">
			An error occurred while trying to load this page. Please try again later.
		</p>
	{/if}
	<div class="mx-auto flex w-fit justify-center gap-2">
		<Button variant="secondary" onclick={() => history.back()} class="gap-1">
			<ChevronLeft class="size-5" />
			Go back
		</Button>
		<Button href="/" class="gap-1">
			<Home class="size-5" />
			Go back to the home page
		</Button>
	</div>
</div>
