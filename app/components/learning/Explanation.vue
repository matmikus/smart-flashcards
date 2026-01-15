<template>
	<article class="p-4 text-white" aria-label="Explanation">
		<h2 class="sr-only">Explanation</h2>
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div
			class="explanation-content overflow-x-scroll"
			aria-live="polite"
			v-html="flashcard?.explanation"
		></div>
		<div class="mt-6 flex justify-end">
			<button
				class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
				@click="closeModal"
			>
				Close
			</button>
		</div>
	</article>
</template>

<script setup lang="ts">
	import type { Flashcard } from '~/types'

	defineProps<{
		flashcard: Flashcard
	}>()

	const { closeModal } = useModal()
</script>

<style scoped>
	.explanation-content :deep(p) {
		@apply mb-4;
	}

	.explanation-content :deep(ul) {
		@apply mb-4;
	}

	.explanation-content :deep(table) {
		@apply w-full border-collapse mb-4 mt-4;
	}

	.explanation-content :deep(li) {
		@apply ml-6 mb-2;
	}

	.explanation-content :deep(pre) {
		@apply bg-slate-900/80 border border-slate-700 rounded-lg p-4 mb-4 mt-4 overflow-x-auto;
		width: fit-content;
	}

	.explanation-content :deep(pre code) {
		@apply text-sm font-mono text-slate-100;
	}

	.explanation-content :deep(code) {
		@apply bg-slate-800/80 text-slate-100 px-1.5 py-0.5 rounded text-sm font-mono;
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
