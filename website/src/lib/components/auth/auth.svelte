<script lang="ts">
	import { page } from '$app/state';
	import miku from '$lib/assets/miku.png?enhanced';
	import LoginForm from '$lib/components/auth/login-form.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { appState } from '$lib/context/state.svelte';
	import { cn } from '$lib/utils';
	import { History, Library, LogIn, LogOut, Settings, User } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import RegisterForm from './register-form.svelte';
	import { goto } from '$app/navigation';

	let user = $derived(appState.user);

	let open = $state(false);

	let formType = $state<'login' | 'register'>('login');
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
			<DropdownMenu.Group>
				<DropdownMenu.Label>Navigation</DropdownMenu.Label>
				<DropdownMenu.Item
					class="flex cursor-pointer items-center gap-2"
					onclick={() => goto('/library')}
				>
					<Library className="size-4" />
					Library
				</DropdownMenu.Item>
				<DropdownMenu.Item
					class="flex cursor-pointer items-center gap-2"
					onclick={() => goto('/history')}
				>
					<History className="size-4" />
					History
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Label>Account</DropdownMenu.Label>
				<DropdownMenu.Item
					class="flex cursor-pointer items-center gap-2"
					onclick={() => goto('/profile')}
				>
					<User className="size-4" />
					Profile
				</DropdownMenu.Item>
				<DropdownMenu.Item
					class="flex cursor-pointer items-center gap-2"
					onclick={() => goto('/settings')}
				>
					<Settings className="size-4" />
					Settings
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				class="flex cursor-pointer items-center gap-2"
				onclick={() => goto(`/auth/logout?redirect=${page.url}`)}
			>
				<LogOut className="size-4" />
				Logout
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else}
	<Dialog.Root onOpenChange={() => (formType = 'login')}>
		<div class="ml-2 rounded-md bg-background">
			<Dialog.Trigger class={buttonVariants()}>
				<LogIn class="mr-2 size-6" />
				Sign in
			</Dialog.Trigger>
		</div>
		<Dialog.Content>
			{#if formType === 'login'}
				<Dialog.Title>Login to AniWays</Dialog.Title>
				<LoginForm />
				<Button variant="secondary" onclick={() => (formType = 'register')}>
					Create an account
				</Button>
			{:else}
				<Dialog.Title>Register to AniWays</Dialog.Title>
				<RegisterForm />
				<Button variant="secondary" onclick={() => (formType = 'login')}>
					Already have an account?
				</Button>
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{/if}
