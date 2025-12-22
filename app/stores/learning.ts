import { defineStore } from 'pinia'
import type { Flashcard } from '~/types'

export const useLearningStore = defineStore('learning', {
	state: () => ({
		setId: null as string | null,
		flashcards: [] as Flashcard[],
	}),
	getters: {
		getFlashcards: (state) => state.flashcards,
		getSetId: (state) => state.setId,
	},
})
