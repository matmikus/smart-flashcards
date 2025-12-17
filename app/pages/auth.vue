<template>
	<div class="max-w-md w-full">
		<h1 class="font-bbh-bartle text-4xl mb-8 text-center">
			SMART FLASHCARDS
		</h1>
		<p class="text-indigo-100 mb-8">
			Please enter your email and password to login or create an account.
		</p>
		<form>
			<div class="mb-4">
				<label for="email" class="block text-indigo-100 mb-2"
					>Email</label
				>
				<input
					type="email"
					id="email"
					class="w-full p-2 rounded-md bg-indigo-700 text-indigo-100"
				/>
			</div>
			<div class="mb-4">
				<label for="password" class="block text-indigo-100 mb-2"
					>Password</label
				>
				<input
					type="password"
					id="password"
					class="w-full p-2 rounded-md bg-indigo-700 text-indigo-100"
				/>
			</div>
			<button
				type="submit"
				class="w-full p-2 rounded-md bg-indigo-500 text-indigo-100"
			>
				Login
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		layout: 'auth',
	})
</script>
