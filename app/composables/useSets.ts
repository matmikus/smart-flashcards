import { useSetsStore } from '~/stores/sets'
import type { Set } from '~/types'

export const useSets = () => {
	const setsStore = useSetsStore()
	const { startLoading, stopLoading } = useLoader()

	const fetchSets = async () => {
		// Skip if already loaded (prevent duplicates)
		if (setsStore.sets.length > 0) {
			return
		}

		// Only show loader on client side
		if (import.meta.client) {
			startLoading('fetch')
		}

		try {
			// useSupabaseClient() works here because composables have Nuxt context
			const supabase = useSupabaseClient()

			const { data, error } = await supabase
				.from('user_set')
				.select('set_data')
				.eq('user_id', useUserStore().userId!)

			if (error) {
				console.error('Supabase error:', error)
				throw error
			}

			setsStore.sets =
				(data as { set_data: Set }[] | null)?.map(
					(set) => set.set_data
				) ?? []
		} catch (err) {
			console.error('Failed to fetch sets:', err)
			throw err
		} finally {
			if (import.meta.client) {
				stopLoading()
			}
		}
	}

	return {
		sets: computed(() => setsStore.getSets),
		getSetDetails: setsStore.getSetDetails,
		addSet: setsStore.addSet,
		updateSet: setsStore.updateSet,
		deleteSet: setsStore.deleteSet,
		fetchSets,
	}
}
