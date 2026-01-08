<template>
	<div class="min-h-screen flex flex-col">
		<!-- Skip to main content link -->
		<a
			href="#main-content"
			class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:p-4 focus:bg-white focus:text-black focus:font-bold focus:underline"
		>
			Skip to main content
		</a>

		<header
			class="bg-indigo-950 text-white p-4 z-20 flex items-center border-b-2 border-purple-500 shadow-lg shadow-purple-500/50"
		>
			<nav class="flex items-center flex-1" aria-label="Main navigation">
				<NuxtLink to="/" aria-label="Go to home page">
					<h1 class="font-bbh-bartle text-sm mr-8 md:text-2xl">
						SMART<span class="hidden md:inline">&nbsp;</span
						>FLASHCARDS
					</h1>
				</NuxtLink>
				<p class="hidden md:block" aria-label="App description">
					Your AI-powered flashcard learning companion
				</p>
			</nav>
			<div
				ref="userMenuRef"
				class="relative flex justify-end text-4xl m-[-8px] px-2"
			>
				<button
					type="button"
					aria-label="Open user menu"
					:aria-expanded="userMenu.isOpen.value"
					aria-haspopup="true"
					class="text-4xl cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-950 rounded"
					@click="userMenu.toggle"
					@keydown.esc="userMenu.close()"
				>
					<span aria-hidden="true">👨🏻‍💼</span>
					<span class="sr-only">User menu</span>
				</button>
				<AppUserDropdown v-if="userMenu.isOpen" />
			</div>
		</header>
		<main
			id="main-content"
			class="text-white p-4 flex justify-center items-center flex-1"
		>
			<div class="w-full md:w-auto">
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
