<template>
	<div
		v-if="setData"
		:class="[
			'p-4 rounded-md bg-slate-800 border-2 shadow-lg flex flex-col relative',
			cardColor!.border,
			cardColor!.shadow,
		]"
	>
		<div class="text-white/70 mb-4">{{ currentFlashcard?.topic }}</div>
		<div class="mb-4">{{ currentFlashcard?.question }}</div>
		<button
			v-for="(item, index) in currentFlashcard?.answers"
			:key="index"
			class="backdrop-blur-sm mt-4 mr-4 transition-colors border border-white/10 w-full p-2 rounded-md shadow-lg transition-all font-mono"
			:disabled="checkedAnswerIndex !== null"
			:class="[
				checkedAnswerIndex === index
					? item.isCorrect
						? 'bg-green-500'
						: 'bg-red-500'
					: 'bg-slate-700/50 hover:bg-slate-700',
				checkedAnswerIndex !== null &&
				checkedAnswerIndex !== index &&
				item.isCorrect
					? 'text-green-500'
					: 'text-white',
			]"
			@click="checkAnswer(index)"
		>
			{{ item.text }}
		</button>
		<div
			v-if="checkedAnswerIndex !== null"
			class="absolute top-0 right-0 w-full h-full flex justify-center items-center"
		>
			<button
				class="h-[200px] text-white font-mono border border-white/10 rounded-md px-16 bg-indigo-950 text-[60px] opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center"
				@click="nextFlashcard"
			>
				<div>NEXT</div>
				<div class="text-[60px] ml-8">➡️</div>
			</button>
		</div>
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

	const nextFlashcard = () => {
		// todo
	}
</script>
