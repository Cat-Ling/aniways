<script lang="ts">
	import { login } from '$lib/api/auth';
	import { loginFormSchema } from '$lib/api/auth/types';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Loader2 } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { arktypeClient } from 'sveltekit-superforms/adapters';

	const form = superForm(
		{ email: '', password: '' },
		{
			SPA: true,
			validators: arktypeClient(loginFormSchema),
			onUpdate: async ({ form }) => {
				if (!form.valid) return;
				await login(fetch, form.data);
				window.location.reload();
			}
		}
	);

	const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" use:enhance class="flex flex-col justify-center gap-2">
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} placeholder="Enter your email" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.password}
				type="password"
				placeholder="Enter your password"
			/>
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
