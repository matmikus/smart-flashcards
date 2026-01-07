<template>
	<div
		v-if="currentFlashcard"
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
			class="absolute top-0 right-0 w-full h-full flex flex-col justify-center items-center bg-black/30"
		>
			<button
				class="px-12 py-12 text-white font-bold rounded-lg shadow-xl shadow-purple-500/60 hover:shadow-purple-400/70 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all border-2 border-purple-400/50 flex items-center gap-4 text-4xl transform hover:scale-105 opacity-30 hover:opacity-100"
				@click="nextFlashcard"
			>
				<span>NEXT</span>
				<span class="text-3xl">➡️</span>
			</button>
			<button
				class="px-7 py-6 mt-4 text-white font-bold rounded-lg shadow-xl shadow-purple-500/60 hover:shadow-purple-400/70 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all border-2 border-purple-400/50 flex items-center gap-4 text-xl transform hover:scale-105 opacity-30 hover:opacity-100"
				@click="onShowExplanation"
			>
				<span>EXPLANATION</span>
				<span class="text-3xl">💡</span>
			</button>
		</div>
	</div>
	<div
		v-else-if="isFinished"
		:class="[
			'p-4 rounded-md bg-slate-800 border-2 shadow-lg flex flex-col relative',
			cardColor!.border,
			cardColor!.shadow,
		]"
	>
		<div class="text-white/70 text-center text-2xl mb-4">
			You have finished the set !
		</div>
		<div class="text-white/70 text-[60px] text-center">🎉🏆👑💪🥳</div>
		<button
			class="w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white mt-4 mr-4 hover:bg-slate-700 transition-colors border border-white/10"
			@click="onStartAgain"
		>
			START AGAIN
		</button>
		<button
			class="w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white mt-4 mr-4 hover:bg-slate-700 transition-colors border border-white/10"
			@click="navigateTo('/')"
		>
			GO TO SETS
		</button>
	</div>
</template>

<script setup lang="ts">
	import type { Flashcard } from '~/types'

	const learningStore = useLearningStore()
	const setData = computed(() => learningStore.getSetData)
	const cardColor = computed(() => cardColors[setData?.value?.color ?? 0])

	const currentFlashcard = ref<Flashcard | null>(null)
	const checkedAnswerIndex = ref<number | null>(null)

	const isFinished = computed(() => learningStore.getIsFinished)

	// Use onMounted to ensure it runs after data is available
	onMounted(async () => {
		const flashcards = learningStore.getFlashcards
		if (flashcards && flashcards.length > 0) {
			const flashcard = await learningStore.pickRandomFlashcard()
			if (flashcard) {
				currentFlashcard.value = flashcard
			}
		}
	})

	const checkAnswer = (index: number) => {
		checkedAnswerIndex.value = index
		if (currentFlashcard.value?.answers?.[index]?.isCorrect) {
			currentFlashcard.value!.status = 'success'
		} else {
			currentFlashcard.value!.status = 'failure'
		}
		learningStore.updateFlashcard(currentFlashcard.value!)
		learningStore.incrementAttempts()
	}

	const nextFlashcard = async () => {
		// Reset the answer state for the new flashcard
		checkedAnswerIndex.value = null

		// Get a new random flashcard (will generate question/answers if needed) but not the same as the current one
		let flashcard
		const remainingFlashcards = learningStore.setData!.flashcards!.filter(
			(f) => f.status !== 'success'
		)

		do {
			flashcard = await learningStore.pickRandomFlashcard()
		} while (
			remainingFlashcards.length > 1 &&
			flashcard?.id === currentFlashcard.value?.id
		)

		if (flashcard) {
			currentFlashcard.value = flashcard
		} else {
			currentFlashcard.value = null
		}
	}

	const onStartAgain = () => {
		window.location.reload()
	}

	const onShowExplanation = async () => {
		const { startLoading, stopLoading } = useLoader()
		const { error, success } = useToast()
		const userStore = useUserStore()

		startLoading('ai')
		try {
			const response = await fetch(
				'https://api.groq.com/openai/v1/chat/completions',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${userStore.getUserAiApiKey}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						model: 'openai/gpt-oss-20b',
						messages: [
							{
								role: 'user',
								content: `
									Explain why the answer is correct or incorrect in context of flashcard quiz named "${learningStore.setData?.name ?? '...'}" 
									and described as "${learningStore.setData?.description ?? '...'}". 
									Question was "${currentFlashcard.value?.question ?? '...'} and answers were "${currentFlashcard.value?.answers?.map((a) => a.text).join(', ') ?? '...'}". 
									User picked answer "${currentFlashcard.value?.answers?.[checkedAnswerIndex.value ?? 0]?.text ?? '...'}". 
									Use language same as the flashcard quiz. 
									Format your response as clean HTML. Use:
									- <strong> for bold text
									- <em> for emphasis
									- <p> for paragraphs
									- <ul> and <li> for lists
									- <table>, <thead>, <tbody>, <tr>, <th>, <td> for tables
									- <code> for inline code
									- <pre><code> for code blocks

									Do not use markdown syntax. Return only HTML. Use language same as the flashcard quiz.
									`,
							},
						],
					}),
				}
			)

			const data = await response.json()

			currentFlashcard.value!.explanation =
				data?.choices[0]?.message?.content

			success('Explanation generated successfully!')
		} catch (err) {
			console.error('Fetch Error:', err)
			error('Failed to connect to AI service')
		} finally {
			stopLoading()
		}

		useModalStore().openModal('explanation', {
			flashcard: currentFlashcard.value,
		})
	}
</script>
