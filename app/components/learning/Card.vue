<template>
	<div
		:class="[
			'p-4 rounded-md bg-slate-800 border-2 shadow-lg flex flex-col',
			cardColor.border,
			cardColor.shadow,
		]"
	>
		<div class="text-white/70 mb-4">Topic here</div>
		<div class="mb-4">Question generated here?</div>
		<button
			v-for="(item, index) in answers"
			:key="index"
			class="bg-slate-700/50 backdrop-blur-sm text-white mt-4 mr-4 hover:bg-slate-700 transition-colors border border-white/10 w-full p-2 rounded-md text-white shadow-lg transition-all"
		>
			{{ item.text }}
		</button>
	</div>
</template>

<script setup lang="ts">
	const setId = useRoute().params.id as string

	const setData = mockSets.find((set) => set.id === setId)

	const cardColor = computed(() => {
		return cardColors[setData!.color]!
	})

	const answers = [
		{ text: 'Answer 1 generated here', isCorrect: true },
		{ text: 'Answer 2 generated here', isCorrect: false },
		{ text: 'Answer 3 generated here', isCorrect: false },
		{ text: 'Answer 4 generated here', isCorrect: false },
	]
</script>
