<template>
	<div
		v-if="setData"
		:class="[
			'relative p-4 rounded-md bg-slate-800 border-2 shadow-lg flex justify-between items-center whitespace-nowrap',
			cardColor?.border,
			cardColor?.shadow,
		]"
	>
		<div class="text-white mr-8">{{ setData?.name }}</div>
		<div class="text-white/70 mr-8">
			passed: {{ passed }} / {{ setData?.flashcards?.length }}
		</div>
		<div class="text-white/70">
			rate: {{ passed }} / {{ attempts }} ({{
				Math.round((passed / (attempts > 0 ? attempts : 1)) * 100)
			}}%)
		</div>
		<div
			class="absolute left-0 bottom-1 w-full h-1 bg-green-500"
			:style="{
				width: `${(passed / (setData?.flashcards?.length ?? 1)) * 100}%`,
			}"
		></div>
	</div>
</template>

<script setup lang="ts">
	const learningStore = useLearningStore()
	const setData = computed(() => learningStore.getSetData)
	const cardColor = computed(() => cardColors[setData?.value?.color ?? 0])
	const passed = computed(
		() =>
			setData?.value?.flashcards?.filter((f) => f.status === 'success')
				.length ?? 0
	)
	const attempts = computed(() => learningStore.attempts)
</script>
