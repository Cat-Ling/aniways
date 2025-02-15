<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { appState } from '$lib/context/state.svelte';
	import { cn } from '$lib/utils';
	import { List, LogIn, LogOut } from 'lucide-svelte';

	let user = $derived(appState.user);

	let open = $state(false);
</script>

{#if user}
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger class={cn('ml-2 transition', open || 'hover:scale-110')}>
			<img
				src={user.picture}
				alt="avatar"
				class="size-10 rounded-full object-cover object-center"
			/>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-56">
			<DropdownMenu.Label>{user.name}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item href="/anime-list" class="flex cursor-pointer items-center gap-2">
				<List className="h-5 w-5" />
				Anime List
			</DropdownMenu.Item>
			<DropdownMenu.Item
				href="/auth/logout?redirect={page.url}"
				class="flex cursor-pointer items-center gap-2"
			>
				<LogOut className="h-5 w-5" />
				Logout
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else}
	<div class="ml-2 rounded-md bg-background">
		<Button href="/auth/login?redirect={page.url}">
			<LogIn class="mr-2 size-6" />
			Sign in
		</Button>
	</div>
{/if}
