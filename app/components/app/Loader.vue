<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition-opacity duration-200"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition-opacity duration-200"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div
				v-if="isLoading"
				class="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
			>
				<div
					class="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700"
				>
					<div
						class="flex flex-col items-center gap-4 justify-between h-[110px]"
					>
						<!-- Fetch Loader (Spinner) -->
						<div
							v-if="['fetch', 'save'].includes(loaderType || '')"
							class="w-12 h-12 border-4 border-[#A855F7] border-t-transparent rounded-full animate-spin"
						/>
						<!-- AI Loader (Custom Animation) -->
						<div v-else-if="loaderType === 'ai'" class="loader" />
						<!-- Message -->
						<p
							v-if="message"
							class="text-white font-semibold text-lg"
						>
							{{ message }}
						</p>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
	const { loaderState, getMessage } = useLoader()

	const isLoading = computed(() => loaderState.value.isLoading)
	const loaderType = computed(() => loaderState.value.type)
	const message = computed(() => getMessage(loaderState.value.type))
</script>

<style scoped>
	.loader {
		--c: no-repeat linear-gradient(#a855f7 0 0);
		background:
			var(--c), var(--c), var(--c), var(--c), var(--c), var(--c),
			var(--c), var(--c), var(--c);
		background-size: 16px 16px;
		animation:
			l32-1 1s infinite,
			l32-2 1s infinite;
	}

	@keyframes l32-1 {
		0%,
		100% {
			width: 45px;
			height: 45px;
		}
		35%,
		65% {
			width: 65px;
			height: 65px;
		}
	}

	@keyframes l32-2 {
		0%,
		40% {
			background-position:
				0 0,
				0 50%,
				0 100%,
				50% 100%,
				100% 100%,
				100% 50%,
				100% 0,
				50% 0,
				50% 50%;
		}
		60%,
		100% {
			background-position:
				0 50%,
				0 100%,
				50% 100%,
				100% 100%,
				100% 50%,
				100% 0,
				50% 0,
				0 0,
				50% 50%;
		}
	}
</style>
