<script lang="ts">
	import { page } from '$app/state';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { appState } from '$lib/context/state.svelte';
	import { cn } from '$lib/utils';
	import { List, LogIn, LogOut } from 'lucide-svelte';
	import { Button } from '../ui/button';
	import { Skeleton } from '../ui/skeleton';
	import miku from '$lib/assets/miku.png?enhanced';

	let user = $derived(appState.user);

	let open = $state(false);
</script>

{#if appState.isLoading}
	<div class="ml-2 size-10 overflow-hidden rounded-full bg-background">
		<Skeleton class="h-full w-full" />
	</div>
{:else if user}
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger class={cn('ml-2 transition', open || 'hover:scale-110')}>
			{#if user.profilePicture}
				<img
					src={user.profilePicture}
					alt="avatar"
					class="size-10 rounded-full object-cover object-center"
				/>
			{:else}
				<enhanced:img
					src={miku}
					alt="avatar"
					class="size-10 rounded-full object-cover object-top"
				/>
			{/if}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-56">
			<DropdownMenu.Label>{user.username}</DropdownMenu.Label>
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
