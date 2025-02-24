<script lang="ts">
	import { providerSchema } from '$lib/api/auth/types';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils';
	import { RefreshCw } from 'lucide-svelte';

	type Props = {
		providers: (typeof providerSchema.infer)[];
		class?: string;
	};

	let { providers, ...props }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={cn('w-full md:w-fit', buttonVariants(), props.class)}
		disabled={providers.length === 0}
	>
		<RefreshCw />
		<span>Pull Library</span>
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Title>Pull Library</Dialog.Title>
		<Dialog.Description>
			Select a provider to pull your library from. This action is irreversible. Any conflicts will
			be resolved in favor of the provider. Proceed with caution.
		</Dialog.Description>
		{#if providers.includes('myanimelist')}
			<Button variant="outline">
				<img src="/mal.svg" alt="MyAnimeList" class="size-6" />
				MyAnimeList
			</Button>
		{/if}
		{#if providers.includes('anilist')}
			<Button variant="outline">
				<img src="/anilist.svg" alt="AniList" class="size-6" />
				AniList
			</Button>
		{/if}
		{#if providers.length !== 2}
			<Button variant="secondary" href="/account">Install other providers</Button>
		{/if}
	</Dialog.Content>
</Dialog.Root>
