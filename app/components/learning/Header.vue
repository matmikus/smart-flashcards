<template>
	<div
		v-if="setData"
		:class="[
			'relative p-4 rounded-md bg-slate-800 border-2 shadow-lg flex flex-col md:flex-row md:justify-between md:items-center whitespace-nowrap',
			cardColor?.border,
			cardColor?.shadow,
		]"
	>
		<div class="text-white w-full md:flex-1">{{ setData?.name }}</div>
		<div class="w-full flex justify-between md:w-auto md:ml-8">
			<div class="text-white/70">
				passed: {{ passed }} / {{ setData?.flashcards?.length }}
			</div>
			<div class="text-white/70 ml-8">
				rate: {{ passed }} / {{ attempts }} ({{
					Math.round((passed / (attempts > 0 ? attempts : 1)) * 100)
				}}%)
			</div>
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
	const passed = computed(() => learningStore.getPassedCount)
	const attempts = computed(() => learningStore.attempts)
</script>
