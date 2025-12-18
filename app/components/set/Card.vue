<template>
	<div
		:class="[
			'p-4 rounded-md w-[200px] bg-slate-800 border-2 shadow-lg',
			cardColor.border,
			cardColor.shadow,
		]"
	>
		<h2
			class="font-bbh-bartle text-2xl mb-4 text-center text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
		>
			{{ index + 1 }}
		</h2>
		<p class="text-white mb-4">{{ set.name }}</p>
		<p class="text-white/70 mb-4">{{ set.flashcards.length }} flashcards</p>
		<button
			:class="[
				'w-full p-2 rounded-md font-semibold text-white shadow-lg transition-all hover:scale-105',
				cardColor.buttonBg,
				cardColor.buttonShadow,
			]"
		>
			🚀 Start Learning
		</button>
		<div class="flex justify-between">
			<button
				:class="[
					'w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white mt-4 mr-4 hover:bg-slate-700 transition-colors border border-white/10',
					cardColor.buttonShadow,
				]"
				@click="openSetSettings"
			>
				⚙️
			</button>
			<button
				:class="[
					'w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white ml-4 mt-4 hover:bg-slate-700 transition-colors border border-white/10',
					cardColor.buttonShadow,
				]"
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

	const cardColor = computed(() => {
		return cardColors[props.set.color]!
	})
</script>
