import type { Set } from '~/types'
import { defineStore } from 'pinia'
import { useUserStore } from '~/stores/user'

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

			const id = crypto.randomUUID()
			const setData = {
				id: id,
				name,
				topics: items,
				color: Math.floor(Math.random() * cardColors.length),
			}

			startLoading('save')
			this.sets.push(setData)

			try {
				// Only execute on client side where Nuxt context is available
				if (import.meta.server) {
					throw new Error('Cannot add set on server side')
				}

				const supabase = useSupabaseClient()

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const { error } = await (supabase.from('user_set') as any)
					.insert({
						user_id: useUserStore().userId,
						set_id: id,
						set_data: setData,
					})
					.select()

				if (error) {
					console.error('Supabase error:', error)
					throw error
				}

				console.log('Set saved successfully!')
				useToast().success('Set saved successfully!')
			} catch (err) {
				console.error('Failed to save set:', err)
				// Revert local state on error
				this.sets.splice(
					this.sets.indexOf(this.sets.find((set) => set.id === id)!),
					1
				)
				useToast().error('Failed to save set')
				throw err
			} finally {
				stopLoading()
			}
		},

		async updateSet(id: string, set: Set) {
			const { startLoading, stopLoading } = useLoader()

			startLoading('save')
			this.sets = this.sets.map((s) => (s.id === id ? set : s))

			try {
				// Only execute on client side where Nuxt context is available
				if (import.meta.server) {
					throw new Error('Cannot update set on server side')
				}

				const supabase = useSupabaseClient()

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const { error } = await (supabase.from('user_set') as any)
					.upsert({
						user_id: useUserStore().userId,
						set_id: id,
						set_data: set,
					})
					.select()

				if (error) {
					console.error('Supabase error:', error)
					throw error
				}

				console.log('Set updated successfully!')
				useToast().success('Set updated successfully!')
			} catch (err) {
				console.error('Failed to updated set:', err)
				useToast().error('Failed to updated set')
				throw err
			} finally {
				stopLoading()
			}
		},

		async deleteSet(id: string) {
			const { startLoading, stopLoading } = useLoader()

			startLoading('save')
			this.sets = this.sets.filter((set) => set.id !== id)
			try {
				// Only execute on client side where Nuxt context is available
				if (import.meta.server) {
					throw new Error('Cannot delete set on server side')
				}

				const supabase = useSupabaseClient()
				const { error } = await supabase
					.from('user_set')
					.delete()
					.eq('user_id', useUserStore().userId!)
					.eq('set_id', id)
				if (error) {
					console.error('Supabase error:', error)
					throw error
				}
				console.log('Set deleted successfully!')
				useToast().success('Set deleted successfully!')
			} catch (err) {
				console.error('Failed to delete set:', err)
				useToast().error('Failed to delete set')
				throw err
			} finally {
				stopLoading()
			}
		},

		async fetchSets() {
			const { startLoading, stopLoading } = useLoader()

			startLoading('fetch')

			try {
				// Only fetch on client side where Nuxt context is available
				if (import.meta.server) {
					return
				}

				const supabase = useSupabaseClient()

				const { data, error } = await supabase
					.from('user_set')
					.select('set_data')
					.eq('user_id', useUserStore().userId!)
				if (error) {
					console.error('Supabase error:', error)
					throw error
				}
				this.sets =
					(data as { set_data: Set }[] | null)?.map(
						(set) => set.set_data
					) ?? []
			} catch (err) {
				console.error('Failed to fetch sets:', err)
				throw err
			} finally {
				stopLoading()
			}
		},
	},
})
