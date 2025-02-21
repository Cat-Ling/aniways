<script lang="ts">
	import Logo from '$lib/assets/logo.png?enhanced';
	import Auth from '$lib/components/auth/auth.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { Shuffle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import SearchButton from './search.svelte';

	let isHidden = false;
	let changeBackground = false;

	let lastScrollY = 0;
	const THRESHOLD = 200;

	const checkScroll = () => {
		if (typeof window === 'undefined') return;

		const currScroll = window.scrollY;
		changeBackground = currScroll > 0;

		if (currScroll > lastScrollY && currScroll > THRESHOLD) {
			isHidden = true;
		} else {
			isHidden = false;
		}

		lastScrollY = currScroll;
	};

	onMount(() => {
		checkScroll();
	});
</script>

<svelte:window on:scroll={checkScroll} />

<nav
	class={cn(
		'fixed left-0 top-0 z-40 flex w-full max-w-[100vw] items-center justify-between border-b border-transparent p-3 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] [transition:border_250ms,background_250ms,transform_500ms] md:px-8',
		changeBackground ? 'border-border bg-card shadow-sm' : 'bg-transparent',
		isHidden ? '-translate-y-full' : 'translate-y-0'
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
