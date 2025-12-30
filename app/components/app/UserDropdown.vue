<template>
	<div
		v-if="userMenu.isOpen.value"
		class="w-[300px] absolute right-0 top-[54px] bg-slate-800 rounded-md p-6 shadow-lg shadow-slate-900/50 text-sm flex-col z-50"
		@click.stop=""
	>
		<div class="flex items-center mb-4">
			<div class="text-gray-400 text-right w-full">user@user.com</div>
		</div>
		<div class="flex flex-col gap-2">
			<div class="text-white">
				GROQ API KEY
				<a
					href="https://youtu.be/TTG7Uo8lS1M?si=R2oMcn6dwvPHx4sw"
					target="_blank"
					>[see youtube tutorial]</a
				>
			</div>
			<input
				v-model="groqApiKey"
				placeholder="Enter your GROQ API key"
				class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			/>
		</div>
		<div class="flex items-center mt-2">
			<button
				class="w-full text-white font-semibold p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white hover:bg-slate-700 transition-colors border border-white/10"
				@click="saveGroqApiKey"
			>
				Save
			</button>
		</div>
		<div class="flex items-center mt-6">
			<button
				class="w-full text-white font-semibold p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white hover:bg-slate-700 transition-colors border border-white/10"
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
	const groqApiKey = ref(userStore.getUserAiApiKey)

	const saveGroqApiKey = () => {
		userStore.setGroqApiKey(groqApiKey.value || '')
		userMenu.toggle()
	}

	const logout = async () => {
		userMenu.toggle()
		await userStore.logout()
		navigateTo('/login')
	}
</script>
