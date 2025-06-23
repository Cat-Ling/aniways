<script lang="ts">
  import { afterNavigate, invalidateAll } from '$app/navigation';
  import { page } from '$app/state';
  import { getLogoutUrl } from '$lib/api/auth';
  import { type user as userSchema } from '$lib/api/auth/types';
  import miku from '$lib/assets/miku.png';
  import LoginForm from '$lib/components/auth/login-form.svelte';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Sheet from '$lib/components/ui/sheet';
  import { cn } from '$lib/utils';
  import { History, Library, LogIn, LogOut, User } from 'lucide-svelte';
  import Button from '../ui/button/button.svelte';
  import RegisterForm from './register-form.svelte';

  type Props = {
    user: typeof userSchema.infer | null;
  };

  let { user }: Props = $props();

  let sheetOpen = $state(false);
  let dialogOpen = $state(false);

  let formType = $state<'login' | 'register'>('login');

  afterNavigate(() => {
    sheetOpen = false;
  });
</script>

{#if user}
  <Sheet.Root bind:open={sheetOpen}>
    <Sheet.Trigger class={cn('ml-2 transition', sheetOpen || 'hover:scale-110')}>
      <img
        src={user.profilePicture ?? miku}
        alt="avatar"
        class="size-10 rounded-full object-cover object-center"
      />
    </Sheet.Trigger>
    <Sheet.Content class="flex flex-col gap-2">
      <Sheet.Header class="mb-4">
        <Sheet.Title class="flex items-center gap-2">
          <img
            src={user.profilePicture ?? miku}
            alt="avatar"
            class="size-10 rounded-full object-cover object-center"
          />
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
      <Button variant="ghost" href="/account" class="justify-start">
        <User />
        Account
      </Button>
      <div class="px-2 py-1.5 text-sm font-semibold">Actions</div>
      <Button
        variant="ghost"
        class="justify-start"
        onclick={async () => {
          const logoutUrl = getLogoutUrl(page.url.toString());
          await fetch(logoutUrl, { credentials: 'include', redirect: 'manual' });
          await invalidateAll();
          sheetOpen = false;
        }}
      >
        <LogOut />
        Logout
      </Button>
    </Sheet.Content>
  </Sheet.Root>
{:else}
  <Dialog.Root onOpenChange={() => (formType = 'login')} bind:open={dialogOpen}>
    <div class="bg-background ml-2 rounded-md">
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
      <Button
        variant="link"
        class="-mt-2 w-fit justify-start p-0"
        href="/forgot-password"
        onclick={() => (dialogOpen = false)}
      >
        Forgot your password?
      </Button>
    </Dialog.Content>
  </Dialog.Root>
{/if}
