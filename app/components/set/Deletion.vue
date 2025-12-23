<template>
	<div>
		<h1 :class="[cardColor.textColor]">Set removal</h1>
		<div
			class="min-h-[300px] flex flex-col gap-4 items-center justify-center"
		>
			<p class="text-white/70">
				Are you sure you want to remove this set?
			</p>
			<button
				:class="[
					'w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white hover:bg-slate-700 transition-colors border border-white/10',
				]"
				@click="removeSet"
			>
				Remove
			</button>
			<button
				:class="[
					'w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white hover:bg-slate-700 transition-colors border border-white/10',
				]"
				@click="cancel"
			>
				Cancel
			</button>
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
