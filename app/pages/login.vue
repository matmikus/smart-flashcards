<template>
	<div class="max-w-md w-full m-2 p-2">
		<h1
			class="font-bbh-bartle mb-8 text-center"
			style="font-size: clamp(1.5rem, 5vw, 2.25rem)"
		>
			SMART FLASHCARDS
		</h1>
		<div
			class="flex justify-between mb-8 gap-2"
			role="tablist"
			aria-label="Authentication mode"
		>
			<button
				type="button"
				role="tab"
				:aria-selected="!isSignUp"
				:aria-controls="'login-panel'"
				class="w-full p-2 rounded-md bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
				:class="{ 'bg-indigo-700': !isSignUp }"
				@click="isSignUp = false"
			>
				Login
			</button>
			<button
				type="button"
				role="tab"
				:aria-selected="isSignUp"
				:aria-controls="'signup-panel'"
				class="w-full p-2 rounded-md bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
				:class="{ 'bg-indigo-700': isSignUp }"
				@click="isSignUp = true"
			>
				Create Account
			</button>
		</div>
		<div
			:id="isSignUp ? 'signup-panel' : 'login-panel'"
			role="tabpanel"
			:aria-labelledby="isSignUp ? 'signup-tab' : 'login-tab'"
		>
			<p class="text-indigo-100 mb-8">
				Please enter your email and password to
				{{ isSignUp ? 'create an account' : 'login' }}.
			</p>
			<form @submit.prevent="handleSubmit">
				<div class="mb-4">
					<label for="email" class="block text-indigo-100 mb-2"
						>Email</label
					>
					<input
						id="email"
						v-model="email"
						type="email"
						autocomplete="email"
						required
						aria-required="true"
						class="w-full p-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>
				<div class="mb-4">
					<label for="password" class="block text-indigo-100 mb-2"
						>Password</label
					>
					<input
						id="password"
						v-model="password"
						type="password"
						autocomplete="password"
						required
						aria-required="true"
						aria-describedby="password-help"
						minlength="6"
						class="w-full p-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
					<span id="password-help" class="sr-only">
						Password must be at least 6 characters long
					</span>
				</div>
				<div
					v-if="error"
					role="alert"
					aria-live="assertive"
					class="mb-4 text-red-400 text-sm"
				>
					{{ error }}
				</div>
				<button
					type="submit"
					:disabled="loading"
					:aria-busy="loading"
					class="w-full p-2 rounded-md bg-indigo-700 text-indigo-100 uppercase font-bold focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{{ isSignUp ? 'Create Account' : 'Login' }}
				</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		layout: 'auth',
	})

	const supabase = useSupabaseClient()
	const email = ref('')
	const password = ref('')
	const isSignUp = ref(false)
	const loading = ref(false)
	const error = ref<string | null>(null)
	const { startLoading, stopLoading } = useLoader()

	const handleSubmit = async () => {
		loading.value = true
		startLoading('fetch')
		error.value = null

		try {
			if (isSignUp.value) {
				const { error: signUpError } = await supabase.auth.signUp({
					email: email.value,
					password: password.value,
				})
				if (signUpError) throw signUpError
			} else {
				const { error: signInError } =
					await supabase.auth.signInWithPassword({
						email: email.value,
						password: password.value,
					})
				if (signInError) throw signInError
				navigateTo('/')
			}
			// Supabase will automatically redirect after successful login
		} catch (err) {
			error.value = (err as Error).message || 'An error occurred'
		} finally {
			loading.value = false
			stopLoading()
		}
	}
</script>
