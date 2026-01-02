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

	// Initialize learning store with the set data (works on both server and client)
	await useAsyncData(`learn-${route.params.id}`, async () => {
		const id = route.params.id
		if (id && typeof id === 'string') {
			learningStore.setCurrentSetData(id)
		}
		return { initialized: true }
	})
</script>
