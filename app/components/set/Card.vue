<template>
	<article
		:class="[
			'p-4 rounded-md w-[200px] min-w-[200px] bg-slate-800 border-2 shadow-lg',
			cardColor.border,
			cardColor.shadow,
		]"
		:aria-label="`Flashcard set: ${set.name}`"
	>
		<h2
			class="font-bbh-bartle text-2xl mb-4 text-center text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
		>
			{{ index + 1 }}
		</h2>
		<h3 class="text-white mb-4 font-semibold">{{ set.name }}</h3>
		<p class="text-white/70 mb-4" aria-label="Number of flashcards">
			{{ set.topics.length }} flashcards
		</p>
		<button
			:class="[
				'w-full p-2 rounded-md font-semibold text-white shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800',
				cardColor.buttonBg,
				cardColor.buttonShadow,
			]"
			:aria-label="`Start learning set: ${set.name}`"
			@click="openSetLearning"
		>
			<span aria-hidden="true">🚀</span>
			<span> Start Learning</span>
		</button>
		<div class="flex justify-between" role="group" aria-label="Set actions">
			<button
				:class="[
					'w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white mt-4 mr-4 hover:bg-slate-700 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500',
				]"
				:aria-label="`Open settings for set: ${set.name}`"
				@click="openSetSettings"
			>
				<span aria-hidden="true">⚙️</span>
				<span class="sr-only">Settings</span>
			</button>
			<button
				:class="[
					'w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white ml-4 mt-4 hover:bg-slate-700 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500',
				]"
				:aria-label="`Delete set: ${set.name}`"
				@click="openSetDeletion"
			>
				<span aria-hidden="true">🗑️</span>
				<span class="sr-only">Delete</span>
			</button>
		</div>
	</article>
</template>

<script setup lang="ts">
	import type { Set } from '@/types'

	const props = defineProps<{
		index: number
		set: Set
	}>()

	const cardColor = computed(() => {
		return cardColors[props.set.color]!
	})

	const { openModal } = useModal()

	const openSetSettings = () => {
		openModal('set-settings', { set: props.set })
	}

	const openSetDeletion = () => {
		openModal('set-deletion', { set: props.set })
	}

	const openSetLearning = () => {
		navigateTo(`/learn/${props.set.id}`)
	}
</script>
