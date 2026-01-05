<template>
	<div class="p-4 text-white">
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div class="explanation-content" v-html="flashcard?.explanation"></div>
	</div>
</template>

<script setup lang="ts">
	import type { Flashcard } from '~/types'

	defineProps<{
		flashcard: Flashcard
	}>()
</script>

<style scoped>
	.explanation-content :deep(table) {
		@apply w-full border-collapse mb-4 mt-4;
	}

	.explanation-content :deep(thead) {
		@apply bg-slate-700/50;
	}

	.explanation-content :deep(th) {
		@apply border border-white/20 px-4 py-2 text-left font-bold;
	}

	.explanation-content :deep(td) {
		@apply border border-white/20 px-4 py-2 text-left;
	}

	.explanation-content :deep(tbody tr:hover) {
		@apply bg-slate-700/30;
	}
</style>
