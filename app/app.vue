<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-4xl font-bold text-white mb-4">TailwindCSS Test</h1>
			<div class="bg-white rounded-lg shadow-xl p-6">
				<p class="text-gray-800 text-lg">
					If you see this styled card, TailwindCSS is working! 🎉
				</p>
				<button
					class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
				>
					Test Button
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
console.log('Hello World')
</script>
