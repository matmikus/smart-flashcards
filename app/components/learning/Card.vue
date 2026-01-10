<template>
	<article
		v-if="currentFlashcard"
		:class="[
			'p-4 rounded-md bg-slate-800 border-2 shadow-lg flex flex-col relative',
			cardColor!.border,
			cardColor!.shadow,
		]"
		aria-label="Flashcard question"
	>
		<div class="text-white/70 mb-4" aria-label="Topic">
			{{ currentFlashcard?.topic }}
		</div>
		<h2 class="mb-4 text-white font-semibold">
			{{ currentFlashcard?.question }}
		</h2>
		<section aria-label="Answer options" role="radiogroup">
			<button
				v-for="(item, index) in currentFlashcard?.answers"
				:key="index"
				role="radio"
				:aria-checked="checkedAnswerIndex === index ? 'true' : 'false'"
				:aria-label="`Answer option ${index + 1}: ${item.text}`"
				:aria-disabled="checkedAnswerIndex !== null"
				class="backdrop-blur-sm mt-4 mr-4 transition-colors border border-white/10 w-full p-2 rounded-md shadow-lg transition-all font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
				@keydown.enter="checkAnswer(index)"
				@keydown.space.prevent="checkAnswer(index)"
			>
				{{ item.text }}
			</button>
		</section>

		<!-- Screen reader announcement for answer result -->
		<div aria-live="polite" aria-atomic="true" class="sr-only">
			<span v-if="checkedAnswerIndex !== null">
				{{
					currentFlashcard?.answers?.[checkedAnswerIndex]?.isCorrect
						? 'Correct answer selected.'
						: 'Incorrect answer selected.'
				}}
			</span>
		</div>
	</article>
	<article
		v-else-if="isFinished"
		:class="[
			'p-4 rounded-md bg-slate-800 border-2 shadow-lg flex flex-col relative',
			cardColor!.border,
			cardColor!.shadow,
		]"
		aria-label="Set completed"
	>
		<h2 class="text-white/70 text-center text-2xl mb-4">
			You have finished the set !
		</h2>
		<div class="text-white/70 text-[60px] text-center" aria-hidden="true">
			🎉🏆👑💪🥳
		</div>
		<button
			class="w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white mt-4 mr-4 hover:bg-slate-700 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			aria-label="Start learning this set again"
			@click="onStartAgain"
		>
			START AGAIN
		</button>
		<button
			class="w-full p-2 rounded-md bg-slate-700/50 backdrop-blur-sm text-white mt-4 mr-4 hover:bg-slate-700 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			aria-label="Go back to sets list"
			@click="navigateTo('/')"
		>
			GO TO SETS
		</button>
	</article>
	<section
		v-if="checkedAnswerIndex !== null"
		class="w-full flex gap-2 items-center"
		aria-label="Answer actions"
	>
		<button
			class="h-[50px] mt-4 flex-1 min-w-0 px-4 text-white font-bold rounded-lg shadow-xl shadow-blue-500/60 bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-blue-400/50 flex items-center justify-center gap-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
			aria-label="Show explanation for this answer"
			@click="onShowExplanation"
			@keydown.enter="onShowExplanation"
		>
			<span>EXPLAIN</span>
			<span class="text-3xl" aria-hidden="true">💡</span>
		</button>
		<button
			class="h-[50px] mt-4 flex-1 min-w-0 px-4 text-white font-bold rounded-lg shadow-xl shadow-green-500/60 bg-gradient-to-r from-green-600 to-emerald-600 border-2 border-green-400/50 flex items-center justify-center gap-2 text-xl focus:outline-none focus:ring-2 focus:ring-green-400"
			aria-label="Go to next flashcard"
			@click="nextFlashcard"
			@keydown.enter="nextFlashcard"
		>
			<span>NEXT</span>
			<span class="text-3xl" aria-hidden="true">➡️</span>
		</button>
	</section>
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
		if (checkedAnswerIndex.value !== null) return
		checkedAnswerIndex.value = index
		if (currentFlashcard.value?.answers?.[index]?.isCorrect) {
			currentFlashcard.value!.status = 'success'
		} else {
			currentFlashcard.value!.status = 'failure'
		}
		learningStore.updateFlashcard(currentFlashcard.value!)
		learningStore.incrementAttempts()
	}

	// Keyboard navigation for answer selection
	const handleKeydown = (e: KeyboardEvent) => {
		if (!currentFlashcard.value?.answers) return

		const answers = currentFlashcard.value.answers
		const currentIndex =
			checkedAnswerIndex.value !== null ? checkedAnswerIndex.value : -1

		if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
			e.preventDefault()
			const nextIndex =
				currentIndex < answers.length - 1 ? currentIndex + 1 : 0
			const nextButton = document.querySelector(
				`[aria-label*="Answer option ${nextIndex + 1}"]`
			) as HTMLElement
			nextButton?.focus()
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
			e.preventDefault()
			const prevIndex =
				currentIndex > 0 ? currentIndex - 1 : answers.length - 1
			const prevButton = document.querySelector(
				`[aria-label*="Answer option ${prevIndex + 1}"]`
			) as HTMLElement
			prevButton?.focus()
		} else if (e.key === 'e' || e.key === 'E') {
			if (checkedAnswerIndex.value !== null) {
				e.preventDefault()
				onShowExplanation()
			}
		} else if (e.key === 'n' || e.key === 'N') {
			if (checkedAnswerIndex.value !== null) {
				e.preventDefault()
				nextFlashcard()
			}
		}
	}

	onMounted(() => {
		window.addEventListener('keydown', handleKeydown)
	})

	onUnmounted(() => {
		window.removeEventListener('keydown', handleKeydown)
	})

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
									Use language same as the language of the flashcard quiz question and answers! 
									Format your response as clean HTML. Use:
									- <strong> for bold text
									- <em> for emphasis
									- <p> for paragraphs
									- <ul> and <li> for lists
									- <table>, <thead>, <tbody>, <tr>, <th>, <td> for tables
									- <code> for inline code
									- <pre><code> for code blocks
									- use some empty lines inside to make it more readable

									Do not use markdown syntax. Return only HTML. Be like a teacher explaining the answer to a student, wanted to help them understand the topic better.
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
