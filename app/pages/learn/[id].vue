<template>
	<div>
		<LearningHeader class="mb-4" />
		<LearningCard />
	</div>
</template>

<script setup lang="ts">
	const learningStore = useLearningStore()
	const { fetchSets } = useSets()
	const route = useRoute()

	// Fetch sets on server and client
	await useAsyncData('sets', async () => {
		await fetchSets()
		return { fetched: true }
	})

	// Initialize learning store with the set data (client-side only to preserve localStorage)
	await useAsyncData(`learn-${route.params.id}`, async () => {
		// Only run on client-side to prevent SSR from clearing localStorage
		if (import.meta.client) {
			const id = route.params.id
			if (id && typeof id === 'string') {
				// Only set if we don't already have data for this set (might be restored from localStorage)
				if (learningStore.setData?.id !== id) {
					learningStore.setCurrentSetData(id)
				}
			}
		}
		return { initialized: true }
	})
</script>
