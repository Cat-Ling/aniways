<script lang="ts">
	import { page } from '$app/state';
	import miku from '$lib/assets/miku.png?enhanced';
	import LoginForm from '$lib/components/auth/login-form.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { appState } from '$lib/context/state.svelte';
	import { cn } from '$lib/utils';
	import { History, Library, LogIn, LogOut, Settings, User } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import RegisterForm from './register-form.svelte';

	let user = $derived(appState.user);

	let open = $state(false);

	let formType = $state<'login' | 'register'>('login');
</script>

{#if appState.isLoading}
	<div class="ml-2 size-10 overflow-hidden rounded-full bg-background">
		<Skeleton class="h-full w-full" />
	</div>
{:else if user}
	<Sheet.Root bind:open>
		<Sheet.Trigger class={cn('ml-2 transition', open || 'hover:scale-110')}>
			{@render image(user.profilePicture)}
		</Sheet.Trigger>
		<Sheet.Content class="flex flex-col gap-2">
			<Sheet.Header class="mb-4">
				<Sheet.Title class="flex items-center gap-2">
					{@render image(user.profilePicture)}
					{user.username}
				</Sheet.Title>
			</Sheet.Header>
			<div class="px-2 py-1.5 text-sm font-semibold">Navigation</div>
			<Button variant="ghost" href="/library" class="justify-start">
				<Library />
				Library
			</Button>
			<Button variant="ghost" href="/history" class="justify-start">
				<History />
				History
			</Button>
			<div class="px-2 py-1.5 text-sm font-semibold">Account</div>
			<Button variant="ghost" href="/profile" class="justify-start">
				<User />
				Profile
			</Button>
			<Button variant="ghost" href="/settings" class="justify-start">
				<Settings />
				Settings
			</Button>
			<div class="px-2 py-1.5 text-sm font-semibold">Actions</div>
			<Button variant="ghost" href="/auth/logout?redirect={page.url}" class="justify-start">
				<LogOut />
				Logout
			</Button>
		</Sheet.Content>
	</Sheet.Root>
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

{#snippet image(img: string | null)}
	{#if img}
		<img src={img} alt="avatar" class="size-10 rounded-full object-cover object-center" />
	{:else}
		<enhanced:img src={miku} alt="avatar" class="size-10 rounded-full object-cover object-top" />
	{/if}
{/snippet}
