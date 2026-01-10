export default defineNuxtPlugin(() => {
	// Only run on client side
	if (import.meta.client) {
		const learningStore = useLearningStore()
		const STORAGE_KEY = 'learning-store'

		// Restore from localStorage on client-side mount
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				const restored = JSON.parse(stored)
				// Only restore if store is empty (not already initialized)
				if (!learningStore.setData && restored.setData) {
					learningStore.setData = restored.setData
					learningStore.attempts = restored.attempts
				}
			}
		} catch (error) {
			console.error(
				'Failed to restore learning store from localStorage:',
				error
			)
		}

		// Subscribe to store changes and auto-save to localStorage
		learningStore.$subscribe((mutation, state) => {
			// Only save if we have setData (don't save empty/null state)
			if (!state.setData) {
				return
			}

			// Only save setData and attempts (not isGeneratingFlashcard)
			try {
				localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({
						setData: state.setData,
						attempts: state.attempts,
					})
				)
			} catch (error) {
				console.error(
					'Failed to save learning store to localStorage:',
					error
				)
			}
		})
	}
})
