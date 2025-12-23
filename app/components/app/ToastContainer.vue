<template>
	<Teleport to="body">
		<div
			class="fixed bottom-4 left-4 z-[100] flex flex-col gap-2 pointer-events-none"
		>
			<AppToast
				v-for="toast in toasts"
				:key="toast.id"
				:toast="toast"
				class="pointer-events-auto"
				@close="removeToast(toast.id)"
			/>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
	const { toasts, removeToast } = useToast()
</script>

