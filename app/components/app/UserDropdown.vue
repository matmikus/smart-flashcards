<template>
	<div
		v-if="userMenu.isOpen.value"
		ref="dropdownRef"
		role="menu"
		aria-label="User menu"
		aria-expanded="true"
		class="w-[300px] absolute right-0 top-[54px] bg-slate-800 rounded-md p-6 shadow-lg shadow-slate-900/50 text-sm flex-col z-50"
		@click.stop=""
		@keydown.esc="userMenu.close()"
		@keydown.tab="handleTab"
	>
		<div class="flex items-center mb-4">
			<div
				class="text-gray-400 text-right w-full"
				aria-label="Logged in as"
			>
				{{ userName }}
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<label for="groq-api-key" class="text-white">
				GROQ API KEY
				<a
					href="https://youtu.be/TTG7Uo8lS1M?si=R2oMcn6dwvPHx4sw"
					target="_blank"
					rel="noopener noreferrer"
					class="text-indigo-500 hover:text-indigo-400 transition-colors"
					aria-label="Watch YouTube tutorial for GROQ API key (opens in new tab)"
				>
					[see youtube tutorial]
				</a>
			</label>
			<input
				id="groq-api-key"
				v-model="groqApiKey"
				type="password"
				aria-describedby="groq-api-key-help"
				placeholder="Enter your GROQ API key"
				class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			/>
			<span id="groq-api-key-help" class="sr-only">
				Enter your GROQ API key for AI-generated explanations
			</span>
		</div>
		<div class="flex items-center mt-2">
			<button
				type="button"
				role="menuitem"
				class="w-full text-white font-semibold p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white hover:bg-slate-700 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				@click="saveGroqApiKey"
			>
				Save
			</button>
		</div>
		<div class="flex items-center mt-6">
			<button
				type="button"
				role="menuitem"
				class="w-full text-white font-semibold p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white hover:bg-slate-700 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				@click="logout"
			>
				Logout
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const userMenu = useUserMenu()
	const userStore = useUserStore()
	const groqApiKey = computed(() => userStore.getUserAiApiKey)
	const userName = computed(() => userStore.getUserEmail)
	const dropdownRef = ref<HTMLElement | null>(null)

	const saveGroqApiKey = async () => {
		try {
			await userStore.setGroqApiKey(groqApiKey.value || '')
			userMenu.toggle()
		} catch (err) {
			console.error('Error saving API key:', err)
		}
	}

	const logout = async () => {
		userMenu.toggle()
		await userStore.logout()
		navigateTo('/login')
	}

	const handleTab = (e: KeyboardEvent) => {
		if (!dropdownRef.value) return

		const focusableElements = dropdownRef.value.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		)
		const firstElement = focusableElements[0] as HTMLElement
		const lastElement = focusableElements[
			focusableElements.length - 1
		] as HTMLElement

		if (e.shiftKey && document.activeElement === firstElement) {
			e.preventDefault()
			lastElement?.focus()
		} else if (!e.shiftKey && document.activeElement === lastElement) {
			e.preventDefault()
			firstElement?.focus()
		}
	}

	// Focus first element when dropdown opens
	watch(
		() => userMenu.isOpen.value,
		(isOpen) => {
			if (isOpen) {
				nextTick(() => {
					const firstInput = dropdownRef.value?.querySelector(
						'input'
					) as HTMLElement
					firstInput?.focus()
				})
			}
		}
	)
</script>
