<script lang="ts">
	import Logo from '$lib/assets/logo.png?enhanced';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { Shuffle } from 'lucide-svelte';
	import { onMount } from 'svelte';

	import Auth from './auth.svelte';
	import SearchButton from './search.svelte';

	let changeBackground = $state(false);

	const onScroll = () => {
		changeBackground = window.scrollY > 0;
	};

	onMount(() => onScroll());
</script>

<svelte:window on:scroll={onScroll} />

<nav
	class={cn(
		'fixed top-0 z-30 flex w-full max-w-[100vw] items-center justify-between border-b border-transparent p-3 transition duration-500 md:px-8',
		changeBackground ? 'border-border bg-card' : 'bg-transparent'
	)}
>
	<a href="/" class="group flex items-center gap-2">
		<enhanced:img src={Logo} alt="logo" class="size-12 transition group-hover:scale-125" />
		<span
			class="hidden font-sora text-3xl font-bold [text-shadow:_0_2px_0_rgb(0_0_0_/_40%)] md:inline"
		>
			aniways
		</span>
	</a>

	<div class="flex items-center gap-2">
		<SearchButton />
		<Button variant="ghost" class="rounded-full hover:bg-primary" href="/random" size="icon">
			<Shuffle class="size-6" />
		</Button>
		<Auth />
	</div>
</nav>
