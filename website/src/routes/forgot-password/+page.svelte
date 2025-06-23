<script lang="ts">
  import { forgotPassword } from '$lib/api/auth';
  import { forgotPasswordFormSchema } from '$lib/api/auth/types';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import { arktypeClient } from 'sveltekit-superforms/adapters';
  import { Input } from '$lib/components/ui/input';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import { Loader2 } from 'lucide-svelte';

  const form = superForm(
    { email: '' },
    {
      SPA: true,
      validators: arktypeClient(forgotPasswordFormSchema),
      onUpdate: async ({ form, cancel }) => {
        if (!form.valid) return;

        try {
          await forgotPassword(fetch, form.data.email);
          toast.success('If the email is registered, a reset link has been sent.');
        } catch (err) {
          toast.error('An error occurred. Please try again later.');
          cancel();
        }
      }
    }
  );

  const { form: formData, enhance, submitting } = form;
</script>

<div class="mx-3 mb-3 mt-20 md:mx-8 md:mb-8">
  <h1 class="font-sora mt-20 text-2xl font-bold">Forgot Password</h1>
  <p class="text-muted-foreground mt-2 text-sm">
    Enter your email address below, and we will send you a link to reset your password.
  </p>
  <form
    method="POST"
    use:enhance
    class="mt-4 flex max-w-md flex-col justify-center gap-2 md:max-w-lg lg:max-w-xl"
  >
    <Form.Field {form} name="email">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Email</Form.Label>
          <Input {...props} bind:value={$formData.email} placeholder="Enter your email" />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Button type="submit" disabled={$submitting} class={buttonVariants({ class: 'mt-3' })}>
      {#if $submitting}
        <Loader2 class="mr-2 size-4 animate-spin" />
      {/if}
      Send Reset Link
    </Form.Button>
  </form>
</div>
