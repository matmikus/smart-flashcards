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
			<div class="text-white">OPENAI API KEY</div>
			<input
				v-model="openaiApiKey"
				class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			/>
		</div>
		<div class="flex items-center mt-2">
			<button
				class="w-full text-white font-semibold p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white hover:bg-slate-700 transition-colors border border-white/10"
				@click="saveOpenaiApiKey"
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
	const openaiApiKey = ref(userStore.getUserAiApiKey)

	const saveOpenaiApiKey = () => {
		userStore.setOpenaiApiKey(openaiApiKey.value || '')
		userMenu.toggle()
	}

	const logout = () => {
		console.log('logout')
		userMenu.toggle()
	}
</script>
