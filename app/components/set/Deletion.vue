<template>
	<div>
		<h1 id="deletion-title" :class="[cardColor.textColor]">Set removal</h1>
		<div
			class="min-h-[300px] flex flex-col gap-4 items-center justify-center"
			role="dialog"
			aria-labelledby="deletion-title"
			aria-describedby="deletion-description"
		>
			<p id="deletion-description" class="text-white/70">
				Are you sure you want to remove this set?
			</p>
			<div
				class="w-full flex flex-col gap-2"
				role="group"
				aria-label="Confirmation actions"
			>
				<button
					type="button"
					:aria-label="`Confirm removal of set: ${set.name}`"
					:class="[
						'w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white hover:bg-slate-700 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500',
					]"
					@click="removeSet"
				>
					Remove
				</button>
				<button
					type="button"
					aria-label="Cancel set removal"
					:class="[
						'w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white hover:bg-slate-700 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500',
					]"
					@click="cancel"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { Set } from '@/types'

	const props = defineProps<{
		set: Set
	}>()

	const setsStore = useSetsStore()

	const { closeModal } = useModal()

	const cardColor = computed(() => {
		return cardColors[props.set.color]!
	})

	const removeSet = () => {
		setsStore.deleteSet(props.set.id).then(() => {
			closeModal()
		})
	}

	const cancel = () => {
		closeModal()
	}
</script>
