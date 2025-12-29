<template>
	<div
		v-if="setData"
		:class="[
			'p-4 rounded-md bg-slate-800 border-2 shadow-lg flex flex-col',
			cardColor!.border,
			cardColor!.shadow,
		]"
	>
		<div class="text-white/70 mb-4">{{ currentFlashcard?.topic }}</div>
		<div class="mb-4">{{ currentFlashcard?.question }}</div>
		<button
			v-for="(item, index) in currentFlashcard?.answers"
			:key="index"
			class="backdrop-blur-sm text-white mt-4 mr-4 transition-colors border border-white/10 w-full p-2 rounded-md text-white shadow-lg transition-all font-mono"
			:disabled="checkedAnswerIndex !== null"
			:class="[
				checkedAnswerIndex === index
					? item.isCorrect
						? 'bg-green-500'
						: 'bg-red-500'
					: 'bg-slate-700/50 hover:bg-slate-700',
			]"
			@click="checkAnswer(index)"
		>
			{{ item.text }}
		</button>
	</div>
</template>

<script setup lang="ts">
	import type { Flashcard } from '~/types'
	import { watchOnce } from '@vueuse/core'

	const learningStore = useLearningStore()
	const setData = computed(() => learningStore.getSetData)
	const currentFlashcard = ref<Flashcard | null>(null)
	const checkedAnswerIndex = ref<number | null>(null)
	const cardColor = cardColors[setData?.value?.color ?? 0]

	watchOnce(
		() => learningStore.getFlashcards,
		async (flashcards) => {
			if (flashcards && flashcards.length > 0) {
				const flashcard = await learningStore.pickRandomFlashcard()
				if (flashcard) {
					currentFlashcard.value = flashcard
				}
			}
		}
	)

	const checkAnswer = (index: number) => {
		checkedAnswerIndex.value = index
		console.log('checkedAnswerIndex', checkedAnswerIndex.value)
		if (currentFlashcard.value?.answers?.[index]?.isCorrect) {
			currentFlashcard.value!.status = 'success'
		} else {
			currentFlashcard.value!.status = 'failure'
		}
		learningStore.updateFlashcard(currentFlashcard.value!)
	}
</script>
