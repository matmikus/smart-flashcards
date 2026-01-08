<template>
	<header
		v-if="setData"
		:class="[
			'relative p-4 rounded-md bg-slate-800 border-2 shadow-lg flex flex-col md:flex-row md:justify-between md:items-center whitespace-nowrap',
			cardColor?.border,
			cardColor?.shadow,
		]"
		aria-label="Learning progress"
	>
		<h1 class="text-white w-full md:flex-1 font-semibold">
			{{ setData?.name }}
		</h1>
		<div
			class="w-full flex justify-between md:w-auto md:ml-8"
			role="group"
			aria-label="Progress statistics"
		>
			<div class="text-white/70" aria-label="Flashcards passed">
				passed: {{ passed }} / {{ setData?.flashcards?.length }}
			</div>
			<div class="text-white/70 ml-8" aria-label="Success rate">
				rate: {{ passed }} / {{ attempts }} ({{
					Math.round((passed / (attempts > 0 ? attempts : 1)) * 100)
				}}%)
			</div>
		</div>
		<div
			class="absolute left-0 bottom-1 h-1 bg-green-500 transition-all duration-300"
			role="progressbar"
			:aria-valuenow="passed"
			:aria-valuemin="0"
			:aria-valuemax="setData?.flashcards?.length ?? 1"
			:aria-label="`Progress: ${passed} out of ${setData?.flashcards?.length} flashcards completed`"
			:style="{
				width: `${(passed / (setData?.flashcards?.length ?? 1)) * 100}%`,
			}"
		></div>
	</header>
</template>

<script setup lang="ts">
	const learningStore = useLearningStore()
	const setData = computed(() => learningStore.getSetData)
	const cardColor = computed(() => cardColors[setData?.value?.color ?? 0])
	const passed = computed(() => learningStore.getPassedCount)
	const attempts = computed(() => learningStore.attempts)
</script>
