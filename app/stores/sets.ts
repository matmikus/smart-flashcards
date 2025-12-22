import type { Set } from '~/types'
import { defineStore } from 'pinia'

export const useSetsStore = defineStore('sets', {
	state: () => ({
		sets: mockSets as Set[],
	}),

	getters: {
		getSets: (state) => state.sets,
		getSetDetails: (state) => {
			return (id: string) => state.sets.find((set) => set.id === id)
		},
	},

	actions: {
		addSet() {
			// todo
		},

		updateSet() {
			// todo
		},

		deleteSet() {
			// todo
		},
	},
})
