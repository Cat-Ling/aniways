<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { StatusError } from '$lib/api';
	import { login } from '$lib/api/auth';
	import { loginFormSchema } from '$lib/api/auth/types';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { arktypeClient } from 'sveltekit-superforms/adapters';

	const form = superForm(
		{ email: '', password: '' },
		{
			SPA: true,
			validators: arktypeClient(loginFormSchema),
			onUpdate: async ({ form, cancel }) => {
				if (!form.valid) return;
				try {
					await login(fetch, form.data);
					await invalidateAll();
				} catch (err) {
					if (err instanceof StatusError && err.status < 500 && err.status >= 400) {
						toast.error('Invalid email or password. Please try again.');
					} else {
						toast.error('An error occurred. Please try again later.');
					}
					cancel();
				}
			}
		}
	);

	const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" use:enhance class="flex flex-col justify-center gap-2">
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} placeholder="Enter your email" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input
					{...props}
					bind:value={$formData.password}
					type="password"
					placeholder="Enter your password"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button disabled={$submitting} class={buttonVariants({ class: 'mt-3' })}>
		{#if $submitting}
			<Loader2 class="animate-spin" />
		{:else}
			Login
		{/if}
	</Form.Button>
</form>
