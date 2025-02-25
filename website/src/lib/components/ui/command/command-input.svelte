<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Command as CommandPrimitive } from 'bits-ui';
	import Search from 'lucide-svelte/icons/search';

	let {
		ref = $bindable(null),
		class: className,
		containerClass,
		value = $bindable(''),
		...restProps
	}: CommandPrimitive.InputProps & {
		containerClass?: string;
	} = $props();
</script>

<div class={cn('flex items-center border-b px-2', containerClass)} data-command-input-wrapper="">
	<Search class="mr-2 size-4 shrink-0 opacity-50" />
	<CommandPrimitive.Input
		class={cn(
			'flex h-11 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			className
		)}
		bind:ref
		{...restProps}
		bind:value
	/>
</div>
