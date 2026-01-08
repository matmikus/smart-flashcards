<template>
	<Teleport to="body">
		<div
			v-if="isLoading"
			role="status"
			aria-live="polite"
			aria-busy="true"
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
						aria-hidden="true"
					/>
					<!-- AI Loader (Custom Animation) -->
					<div
						v-else-if="loaderType === 'ai'"
						class="loader"
						aria-hidden="true"
					/>
					<!-- Message -->
					<p
						v-if="message"
						class="text-white font-semibold text-lg"
						aria-live="polite"
					>
						{{ message }}
					</p>
					<span v-else class="sr-only">Loading...</span>
				</div>
			</div>
		</div>
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
