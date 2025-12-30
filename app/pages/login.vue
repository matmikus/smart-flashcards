<template>
	<div class="max-w-md w-full">
		<h1 class="font-bbh-bartle text-4xl mb-8 text-center">
			SMART FLASHCARDS
		</h1>
		<div class="flex justify-between mb-8 gap-2">
			<button
				class="w-full p-2 rounded-md bg-indigo-400"
				:class="{ 'bg-indigo-700': !isSignUp }"
				@click="isSignUp = false"
			>
				Login
			</button>
			<button
				class="w-full p-2 rounded-md bg-indigo-400"
				:class="{ 'bg-indigo-700': isSignUp }"
				@click="isSignUp = true"
			>
				Create Account
			</button>
		</div>
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
					required
					class="w-full p-2 rounded-md bg-indigo-700 text-indigo-100"
				/>
			</div>
			<div class="mb-4">
				<label for="password" class="block text-indigo-100 mb-2"
					>Password</label
				>
				<input
					id="password"
					v-model="password"
					required
					minlength="6"
					type="password"
					class="w-full p-2 rounded-md bg-indigo-700 text-indigo-100"
				/>
			</div>
			<div v-if="error" class="mb-4 text-red-400 text-sm">
				{{ error }}
			</div>
			<button
				type="submit"
				:disabled="loading"
				class="w-full p-2 rounded-md bg-indigo-700 text-indigo-100"
			>
				Start
			</button>
		</form>
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
