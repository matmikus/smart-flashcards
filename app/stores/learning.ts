import type { Answer, Flashcard, SetData } from '~/types'
import { defineStore } from 'pinia'
import { useUserStore } from '~/stores/user'
import { useLoader } from '~/composables/useLoader'
import { useToast } from '~/composables/useToast'

const STORAGE_KEY = 'learning-store'

// Helper functions for localStorage (client-side only)
const saveToLocalStorage = (data: {
	setData: SetData | null
	attempts: number
}) => {
	if (import.meta.client && typeof window !== 'undefined') {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
		} catch (error) {
			console.error(
				'Failed to save learning store to localStorage:',
				error
			)
		}
	}
}

const loadFromLocalStorage = (): {
	setData: SetData | null
	attempts: number
} | null => {
	if (import.meta.client && typeof window !== 'undefined') {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				return JSON.parse(stored)
			}
		} catch (error) {
			console.error(
				'Failed to load learning store from localStorage:',
				error
			)
		}
	}
	return null
}

export const useLearningStore = defineStore('learning', {
	state: () => {
		// Try to restore from localStorage on initialization
		const restored = loadFromLocalStorage()
		return {
			setData: restored?.setData ?? null,
			isGeneratingFlashcard: false,
			attempts: restored?.attempts ?? 0,
		}
	},
	getters: {
		getFlashcards: (state) => state.setData?.flashcards,
		getSetId: (state) => state.setData?.id,
		getSetColor: (state) => state.setData?.color,
		getSetData: (state) => state.setData,
		getPassedCount: (state) =>
			state.setData?.flashcards?.filter((f) => f.status === 'success')
				.length ?? 0,
		getIsFinished: (state) =>
			state.setData?.flashcards?.every((f) => f.status === 'success'),
		getRemainingFlashcards: (state) =>
			state.setData?.flashcards?.filter((f) => f.status !== 'success'),
	},
	actions: {
		setCurrentSetData(id: string) {
			// Only run on client-side to prevent SSR from clearing localStorage
			if (import.meta.server) {
				return
			}

			const data = useSetsStore().getSetDetails(id)
			if (data) {
				// Check if we already have data for this set (from localStorage restoration)
				if (this.setData?.id === id) {
					// Already restored, don't overwrite
					return
				}

				// Check if we have saved progress for this set in localStorage
				const restored = loadFromLocalStorage()
				if (restored?.setData?.id === id && restored.setData) {
					// Restore saved progress for this set
					this.setData = restored.setData
					this.attempts = restored.attempts
					// Don't save here - let the subscription handle it to avoid overwriting
					return
				}

				// Only initialize new set if we don't have saved data
				// Initialize new set
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
				// Save after initializing new set
				this.saveToStorage()
			}
		},
		async pickRandomFlashcard(): Promise<Flashcard | null> {
			const flashcards = this.getRemainingFlashcards

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
										content: `Generate ABCD question and 4 answers (1 correct and 3 incorrect) about "${flashcard?.topic ?? '...'}"" in context of flashcard quiz named "${this.setData?.name ?? '...'}" and described as "${this.setData?.description ?? '...'}". Return only JSON object with properties "question" and "answers", where answers have just text items, and first one is correct, no other text in your response. Example question and answers for example topic "France": {"question": "What is the capital of France?", "answers": ["Paris", "London", "Berlin", "Madrid"]}`,
									},
								],
							}),
						}
					)

					const data = await response.json()

					const content = JSON.parse(
						data?.choices[0]?.message?.content ?? '{}'
					)

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
					stopLoading()
					this.isGeneratingFlashcard = false
					return await this.pickRandomFlashcard()
				}
			}
			return null
		},
		updateFlashcard(flashcard: Flashcard) {
			if (this.setData?.flashcards) {
				// Find the index instead of mapping
				const index = this.setData.flashcards.findIndex(
					(f) => f.id === flashcard.id
				)
				if (index !== -1) {
					// Update in place - Vue reactivity will detect the change
					this.setData.flashcards[index] = flashcard
					if (this.getIsFinished) {
						this.clearStorage()
					}
					// Save after update
					this.saveToStorage()
				}
			}
		},
		incrementAttempts() {
			this.attempts++
			// Save after increment
			this.saveToStorage()
		},
		saveToStorage() {
			// Save setData and attempts to localStorage
			saveToLocalStorage({
				setData: this.setData,
				attempts: this.attempts,
			})
		},
		clearStorage() {
			// Clear localStorage (useful when starting a new set)
			if (import.meta.client && typeof window !== 'undefined') {
				localStorage.removeItem(STORAGE_KEY)
			}
		},
	},
})
