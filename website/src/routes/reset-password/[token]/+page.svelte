<script lang="ts">
  import { goto } from '$app/navigation';
  import { resetPassword } from '$lib/api/auth';
  import { resetPasswordFormSchema } from '$lib/api/auth/types';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { cn } from '$lib/utils';
  import { Loader2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { arktypeClient } from 'sveltekit-superforms/adapters';

  let { data } = $props();

  let username = $derived(data.user?.username);
  let error = $derived(data.error);

  const form = superForm(
    { token: data.token, password: '', confirmPassword: '' },
    {
      SPA: true,
      validators: arktypeClient(resetPasswordFormSchema),
      onUpdate: async ({ form, cancel }) => {
        if (!form.valid) return;

        try {
          await resetPassword(fetch, {
            ...form.data,
            token: data.token!
          });
          toast.success('Password has been reset successfully.');
          goto('/');
        } catch (err) {
          toast.error('An error occurred while resetting the password. Please try again.');
          cancel();
        }
      }
    }
  );

  const { form: formData, enhance, submitting } = form;
</script>

<div class="mx-3 mb-3 mt-20 md:mx-8 md:mb-8">
  <h1 class="font-sora mt-20 text-2xl font-bold">Reset Password</h1>
  <p class={cn('text-muted-foreground mt-2', error ? 'text-red-500' : '')}>
    {#if !error}
      Enter a new password for {username}.
    {/if}
  </p>
  {#if !error}
    <form
      method="POST"
      use:enhance
      class="mt-4 flex max-w-md flex-col justify-center gap-2 md:max-w-lg lg:max-w-xl"
    >
      <Form.Field {form} name="password">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>New Password</Form.Label>
            <Input
              {...props}
              bind:value={$formData.password}
              type="password"
              placeholder="Enter new password"
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="confirmPassword">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Confirm Password</Form.Label>
            <Input
              {...props}
              bind:value={$formData.confirmPassword}
              type="password"
              placeholder="Confirm new password"
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Button type="submit" disabled={$submitting} class={buttonVariants({ class: 'mt-3' })}>
        {#if $submitting}
          <Loader2 class="mr-2 size-4 animate-spin" />
        {/if}
        Reset Password
      </Form.Button>
    </form>
    <p class="text-muted-foreground mt-2">Please enter a new password to continue.</p>
  {:else}
    <p class="mt-2 font-bold text-red-500">
      Link is invalid or has expired. Please try requesting a new password reset link.
    </p>
  {/if}
</div>
