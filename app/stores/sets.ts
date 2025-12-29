import type { Set } from '~/types'
import { defineStore } from 'pinia'

export const useSetsStore = defineStore('sets', {
	state: () => ({
		sets: [] as Set[],
	}),

	getters: {
		getSets: (state) => state.sets,
		getSetDetails: (state) => {
			return (id: string) => state.sets.find((set) => set.id === id)
		},
	},

	actions: {
		async addSet(name: string, items: string[]) {
			const { startLoading, stopLoading } = useLoader()

			startLoading('save')
			this.sets.push({
				id: crypto.randomUUID(),
				name,
				topics: items,
				color: Math.floor(Math.random() * cardColors.length),
			})

			// TODO: Implement actual API call to update the set
			await new Promise((resolve) => setTimeout(resolve, 1000))

			stopLoading()
		},

		async updateSet(id: string, set: Set) {
			const { startLoading, stopLoading } = useLoader()

			startLoading('save')
			this.sets = this.sets.map((s) => (s.id === id ? set : s))

			// TODO: Implement actual API call to update the set
			await new Promise((resolve) => setTimeout(resolve, 1000))

			stopLoading()
		},

		async deleteSet(id: string) {
			const { startLoading, stopLoading } = useLoader()

			startLoading('save')
			this.sets = this.sets.filter((set) => set.id !== id)

			// TODO: Implement actual API call to delete the set
			await new Promise((resolve) => setTimeout(resolve, 1000))

			stopLoading()
		},
	},
})
