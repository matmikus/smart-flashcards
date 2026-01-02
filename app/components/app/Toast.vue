<template>
	<Transition
		enter-active-class="transition-all duration-300"
		enter-from-class="opacity-0 translate-x-full"
		enter-to-class="opacity-100 translate-x-0"
		leave-active-class="transition-all duration-300"
		leave-from-class="opacity-100 translate-x-0"
		leave-to-class="opacity-0 translate-x-full"
	>
		<div
			v-if="toast"
			:class="[
				'flex items-center gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-md',
				toastClasses,
			]"
		>
			<div class="flex-shrink-0 text-xl">{{ iconComponent }}</div>
			<p class="flex-1 font-medium">{{ toast.message }}</p>
			<button
				class="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
				@click="$emit('close')"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	</Transition>
</template>

<script setup lang="ts">
	import type { Toast } from '~/composables/useToast'

	const props = defineProps<{
		toast: Toast
	}>()

	defineEmits<{
		close: []
	}>()

	const toastClasses = computed(() => {
		const classes = {
			success: 'bg-green-600 text-white',
			error: 'bg-red-600 text-white',
			warning: 'bg-yellow-600 text-white',
			info: 'bg-blue-600 text-white',
		}
		return classes[props.toast.type] || classes.info
	})

	const iconComponent = computed(() => {
		const icons = {
			success: '✓',
			error: '✕',
			warning: '⚠',
			info: 'ℹ',
		}
		return icons[props.toast.type] || icons.info
	})
</script>
