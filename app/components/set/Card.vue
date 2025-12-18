<template>
	<div
				class="bg-indigo-700 p-4 rounded-md w-[200px]"
			>
				<h2 class="font-bbh-bartle text-2xl mb-4 text-center">
					{{ index + 1 }}
				</h2>
				<p class="text-indigo-100 mb-4">{{ set.name }}</p>
				<p class="text-indigo-100 mb-4">
					{{ set.flashcards.length }} flashcards
				</p>
				<button
					class="w-full p-2 rounded-md bg-indigo-500 text-indigo-100"
				>
					🚀 Start Learning
				</button>
				<div class="flex justify-between">
					<button
						class="w-full p-2 rounded-md bg-indigo-500 text-indigo-100 mt-4 mr-4"
						@click="openSetSettings"
					>
						⚙️
					</button>
					<button
						class="w-full p-2 rounded-md bg-indigo-500 text-indigo-100 ml-4 mt-4"
						@click="openSetStats"
					>
						📈
					</button>
				</div>
			</div>
</template>

<script setup lang="ts">
	import type { Set } from '@/types'

	const props = defineProps<{
		index: number
		set: Set
	}>()

	const { openModal } = useModal()

	const openSetSettings = () => {
		openModal('set-settings', { set: props.set })
	}

	const openSetStats = () => {
		openModal('set-stats', { set: props.set })
	}
</script>