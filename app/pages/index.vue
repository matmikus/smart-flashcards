<template>
	<div>
		<h1 class="mb-4">Your Sets</h1>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div
				v-for="(set, index) in sets"
				:key="set.id"
				class="bg-indigo-700 p-4 rounded-md w-[200px]"
			>
				<h2 class="font-bbh-bartle text-2xl mb-4 text-center">
					{{ index + 1 }}
				</h2>
				<p class="text-indigo-100 mb-4">{{ set.name }}</p>
				<p class="text-indigo-100 mb-4">
					{{ set.flashcards.length }} flashcards
				</p>
				<button
					class="w-full p-2 rounded-md bg-indigo-500 text-indigo-100"
				>
					🚀 Start Learning
				</button>
				<div class="flex justify-between">
					<button
						class="w-full p-2 rounded-md bg-indigo-500 text-indigo-100 mt-4 mr-4"
					>
						⚙️
					</button>
					<button
						class="w-full p-2 rounded-md bg-indigo-500 text-indigo-100 ml-4 mt-4"
					>
						📈
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const sets = [
		{
			id: 1,
			name: 'JavaScript Core',
			flashcards: ['var', 'let', 'const', 'function', 'class', 'object', 'array', 'string', 'number', 'boolean'],
		},
		{
			id: 2,
			name: 'TypeScript',
			flashcards: ['interface', 'type', 'class', 'function', 'enum', 'namespace', 'module', 'import', 'export'],
		},
		{
			id: 3,
			name: 'Vue.js / Nuxt.js',
			flashcards: ['v-if', 'v-else', 'v-else-if', 'v-for', 'v-model', 'v-on', 'v-bind', 'v-html', 'v-text', 'v-show'],
		},
		{
			id: 4,
			name: 'React.js',
			flashcards: ['useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue'],
		},
		{
			id: 5,
			name: 'Node.js',
			flashcards: ['require', 'module', 'exports', 'import', 'export', 'import.meta', 'process', 'console', 'fs', 'path'],
		},
	]
</script>
