<script lang="ts">
	import Logo from '$lib/assets/logo.png';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { LogIn, Search, Shuffle } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';

	let changeBackground = $state(false);

	const onScroll = () => {
		changeBackground = window.scrollY > 0;
	};

	onMount(() => onScroll());
</script>

<svelte:window on:scroll={onScroll} />

<nav
	class={cn(
		'fixed top-0 z-30 flex w-full items-center justify-between border-b border-transparent p-3 px-8 transition duration-500',
		changeBackground ? 'border-border bg-card' : 'bg-transparent'
	)}
>
	<a href="/" class="group flex items-center gap-2">
		<img src={Logo} alt="logo" class="size-12 transition group-hover:scale-125" />
		<span class="font-sora text-3xl font-bold [text-shadow:_0_2px_0_rgb(0_0_0_/_40%)]">
			aniways
		</span>
	</a>

	<div class="flex items-center gap-2">
		<Button variant="ghost" class="rounded-full hover:bg-primary">
			<Search class="size-6" />
		</Button>
		<Button variant="ghost" class="rounded-full hover:bg-primary">
			<Shuffle class="size-6" />
		</Button>
		<div class="bg-background">
			<Button href="/auth/login">
				<LogIn class="mr-2 size-6" />
				Sign in
			</Button>
		</div>
	</div>
</nav>
