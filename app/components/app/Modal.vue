<template>
	<Teleport to="body">
		<div
			v-if="modelValue"
			role="dialog"
			aria-modal="true"
			:aria-labelledby="title ? 'modal-title' : undefined"
			aria-describedby="modal-description"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
			@click.self="handleClose"
			@keydown.esc="handleClose"
			@keydown.tab="handleTab"
		>
			<div
				ref="modalContentRef"
				class="bg-slate-800 rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative"
				@click.stop
			>
				<button
					ref="closeButtonRef"
					class="absolute top-0 right-0 p-3 text-gray-400 hover:text-gray-100 transition-colors ml-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
					aria-label="Close modal"
					@click="handleClose"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
					<span class="sr-only">Close</span>
				</button>
				<div class="p-4">
					<h2 v-if="title" id="modal-title" class="sr-only">
						{{ title }}
					</h2>
					<div id="modal-description" class="sr-only">
						Modal dialog
					</div>
					<slot />
				</div>
				<div
					v-if="$slots.footer"
					class="p-4 border-t sticky bottom-0 bg-white"
				>
					<slot name="footer" />
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
	const props = defineProps<{
		modelValue: boolean
		title?: string
	}>()

	const emit = defineEmits<{
		'update:modelValue': [value: boolean]
	}>()

	const modalContentRef = ref<HTMLElement | null>(null)
	const closeButtonRef = ref<HTMLElement | null>(null)
	const previousActiveElement = ref<HTMLElement | null>(null)

	const handleClose = () => {
		emit('update:modelValue', false)
		// Restore focus to previous element
		if (previousActiveElement.value) {
			previousActiveElement.value.focus()
		}
	}

	const handleTab = (e: KeyboardEvent) => {
		if (!modalContentRef.value) return

		const focusableElements = modalContentRef.value.querySelectorAll(
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

	// Focus management
	watch(
		() => props.modelValue,
		(isOpen) => {
			if (isOpen) {
				// Store current active element
				previousActiveElement.value =
					document.activeElement as HTMLElement
				// Focus first focusable element in modal
				nextTick(() => {
					if (modalContentRef.value) {
						const firstFocusable =
							modalContentRef.value.querySelector(
								'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
							) as HTMLElement
						firstFocusable?.focus()
					}
				})
			}
		}
	)
</script>
