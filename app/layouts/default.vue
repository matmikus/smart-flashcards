<template>
	<div class="min-h-screen flex flex-col">
		<header
			class="bg-indigo-950 text-white p-4 z-20 flex items-center border-b-2 border-purple-500 shadow-lg shadow-purple-500/50"
		>
			<NuxtLink to="/">
				<h1 class="font-bbh-bartle text-2xl mr-8">
					SMART&nbsp;&nbsp;FLASHCARDS
				</h1>
			</NuxtLink>
			<p>Your AI-powered flashcard learning companion</p>
			<div
				ref="userMenuRef"
				class="relative flex-1 flex justify-end text-4xl m-[-8px] px-2"
			>
				<div
					class="text-4xl cursor-pointer select-none"
					@click="userMenu.toggle"
				>
					👨🏻‍💼
				</div>
				<AppUserDropdown v-if="userMenu.isOpen" />
			</div>
		</header>
		<main class="text-white p-4 flex justify-center items-center flex-1">
			<div>
				<slot />
			</div>
		</main>
		<AppModalContainer />
		<AppToastContainer />
		<AppLoader />
	</div>
</template>

<script setup lang="ts">
	const userMenu = useUserMenu()
	const userMenuRef = ref<HTMLElement | null>(null)

	const handleClickOutside = () => {
		if (userMenu.isOpen.value) {
			userMenu.close()
		}
	}

	useClickOutside(userMenuRef as Ref<HTMLElement | null>, handleClickOutside)
</script>
