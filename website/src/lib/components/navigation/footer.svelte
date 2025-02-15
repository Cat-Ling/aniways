<script lang="ts">
	import Logo from '$lib/assets/logo.png?enhanced';
	import { Home, Search, Shuffle } from 'lucide-svelte';
	import { Button } from '../ui/button';
	import Input from '../ui/input/input.svelte';
	import { afterNavigate } from '$app/navigation';

	type Props = {
		genres: { value: string; label: string }[];
	};

	let { genres }: Props = $props();
	let value = $state('');

	afterNavigate(() => {
		value = '';
	});
</script>

<footer class="flex w-full flex-col gap-6 border-t bg-card p-6 md:p-8">
	<a href="/" class="group flex items-center gap-2">
		<enhanced:img src={Logo} alt="logo" class="size-12 transition group-hover:scale-125" />
		<span class="font-sora text-3xl font-bold [text-shadow:_0_2px_0_rgb(0_0_0_/_40%)]">
			aniways
		</span>
	</a>

	<div class="grid w-full grid-cols-3 gap-3 md:flex">
		<Button variant="ghost" class="font-sora" href="/">
			<Home class="mr-2" />
			Home
		</Button>
		<Button variant="ghost" class="font-sora" href="/search">
			<Search class="mr-2" />
			Search
		</Button>
		<Button variant="ghost" class="font-sora" href="/random">
			<Shuffle class="mr-2" />
			Random
		</Button>
	</div>

	<form action="/search" method="get" class="flex gap-2 md:w-fit">
		<Input name="q" placeholder="Search for animes..." class="w-full md:min-w-60" bind:value />
		<Button type="submit">
			<Search class="mr-2" />
			Search
		</Button>
	</form>

	<div class="flex w-full flex-wrap gap-3">
		{#each genres as genre}
			<Button variant="secondary" href="/genre/{genre.value}">{genre.label}</Button>
		{/each}
	</div>
</footer>
