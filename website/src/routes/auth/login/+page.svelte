<script lang="ts">
	import { page } from '$app/state';
	import { login } from '$lib/api/auth';
	import { loginFormSchema } from '$lib/api/auth/types';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
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
				const redirectTo = page.url.searchParams.get('redirect') || '/';
				window.location.href = redirectTo;
			}
		}
	);

	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>Login to AniWays</title>
</svelte:head>

<section class="px-3 pt-20 md:px-8">
	<h1 class="mb-8 font-sora text-2xl font-bold">Login to AniWays</h1>
	<div class="flex gap-2">
		<form method="POST" use:enhance class="flex-1">
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} bind:value={$formData.password} type="password" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button>Submit</Form.Button>
		</form>
	</div>
</section>
