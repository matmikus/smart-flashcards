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
				v-if="modelValue"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
				@click.self="$emit('update:modelValue', false)"
			>
				<Transition
					enter-active-class="transition-all duration-200"
					enter-from-class="opacity-0 scale-95"
					enter-to-class="opacity-100 scale-100"
					leave-active-class="transition-all duration-200"
					leave-from-class="opacity-100 scale-100"
					leave-to-class="opacity-0 scale-95"
				>
					<div
						v-if="modelValue"
						class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
						@click.stop
					>
						<div class="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
							<slot name="header">
								<h2 v-if="title" class="text-xl font-bold text-gray-900">
									{{ title }}
								</h2>
							</slot>
							<button
								@click="$emit('update:modelValue', false)"
								class="text-gray-400 hover:text-gray-600 transition-colors ml-4"
								aria-label="Close modal"
							>
								<svg
									class="w-6 h-6"
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
						<div class="p-4">
							<slot />
						</div>
						<div v-if="$slots.footer" class="p-4 border-t sticky bottom-0 bg-white">
							<slot name="footer" />
						</div>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
defineProps<{
	modelValue: boolean
	title?: string
}>()

defineEmits<{
	'update:modelValue': [value: boolean]
}>()
</script>