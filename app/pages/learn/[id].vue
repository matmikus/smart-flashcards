<template>
	<div>
		<LearningHeader class="mb-4" />
		<LearningCard />
	</div>
</template>

<script setup lang="ts">
	const learningStore = useLearningStore()

	const route = useRoute()

	onMounted(() => {
		const id = route.params.id
		if (id && typeof id === 'string') {
			learningStore.setCurrentSetData(id)
		}
	})
</script>
