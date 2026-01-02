import type { Answer, Flashcard, SetData } from '~/types'
import { defineStore } from 'pinia'
import { useUserStore } from '~/stores/user'
import { useLoader } from '~/composables/useLoader'
import { useToast } from '~/composables/useToast'

export const useLearningStore = defineStore('learning', {
	state: () => ({
		setData: null as SetData | null,
		isGeneratingFlashcard: false,
		attempts: 0,
	}),
	getters: {
		getFlashcards: (state) => state.setData?.flashcards,
		getSetId: (state) => state.setData?.id,
		getSetColor: (state) => state.setData?.color,
		getSetData: (state) => state.setData,
	},
	actions: {
		setCurrentSetData(id: string) {
			const data = useSetsStore().getSetDetails(id)
			if (data) {
				this.setData = {
					...data,
					flashcards: data.topics.map(
						(topic: string): Flashcard => ({
							id: crypto.randomUUID(),
							topic: topic,
							answers: [],
							status: 'waiting',
						})
					),
				}

				this.attempts = 0
			}
		},
		async pickRandomFlashcard() {
			console.log('pickRandomFlashcard')
			const flashcards = this.getFlashcards?.filter(
				(f) => f.status !== 'success'
			)

			if (flashcards && flashcards.length > 0) {
				const randomIndex = Math.floor(
					Math.random() * flashcards.length
				)
				const flashcard = flashcards[randomIndex]!

				if (flashcard.question && flashcard.answers) {
					return flashcard
				}

				if (this.isGeneratingFlashcard) {
					return null
				} else {
					this.isGeneratingFlashcard = true
				}

				const { startLoading, stopLoading } = useLoader()
				const { error, success } = useToast()
				const userStore = useUserStore()

				try {
					startLoading('ai')

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
										content: `Generate ABCD question and 4 answers (1 correct and 3 incorrect) about "${flashcard?.topic ?? '...'}"" in context of flashcard quiz named "${this.setData?.name ?? '...'}". Return only JSON object with properties "question" and "answers", where answers have just text items, and first one is correct, no other text in your response.`,
									},
								],
							}),
						}
					)

					const data = await response.json()

					const content = JSON.parse(
						data?.choices[0]?.message?.content ?? '{}'
					)
					console.log(content)

					flashcard.question = content.question
					flashcard.answers = content.answers
						.map(
							(answer: string, index: number): Answer => ({
								id: crypto.randomUUID(),
								text: answer,
								isCorrect: index === 0,
							})
						)
						.sort((a: Answer, b: Answer) =>
							a.id.localeCompare(b.id)
						)

					this.updateFlashcard(flashcard)

					success('Flashcard generated successfully!')

					stopLoading()
					this.isGeneratingFlashcard = false

					return flashcard
				} catch (err) {
					console.error('Fetch Error:', err)
					error('Failed to connect to AI service')
					this.pickRandomFlashcard()
				}
			}
			return null
		},
		updateFlashcard(flashcard: Flashcard) {
			if (this.setData?.flashcards) {
				this.setData.flashcards = this.setData.flashcards.map((f) =>
					f.id === flashcard.id ? flashcard : f
				)
			}
		},
		incrementAttempts() {
			this.attempts++
		},
	},
})
