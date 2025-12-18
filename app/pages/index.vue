<template>
	<div>
		<div class="flex justify-between items-center mb-4">
			<h1 class="mb-4">Your Sets</h1>
			<button class="bg-indigo-500 text-indigo-100 p-2 rounded-md" @click="createNewSet">
				Create New Set
			</button>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<SetCard
				v-for="(set, index) in sets"
				:key="set.id"
				:index="index"
				:set="set"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	const sets = [
		{
			id: 1,
			name: 'JavaScript Core',
			flashcards: [
				'var',
				'let',
				'const',
				'function',
				'class',
				'object',
				'array',
				'string',
				'number',
				'boolean',
			],
		},
		{
			id: 2,
			name: 'TypeScript',
			flashcards: [
				'interface',
				'type',
				'class',
				'function',
				'enum',
				'namespace',
				'module',
				'import',
				'export',
			],
		},
		{
			id: 3,
			name: 'Vue.js / Nuxt.js',
			flashcards: [
				'v-if',
				'v-else',
				'v-else-if',
				'v-for',
				'v-model',
				'v-on',
				'v-bind',
				'v-html',
				'v-text',
				'v-show',
			],
		},
		{
			id: 4,
			name: 'React.js',
			flashcards: [
				'useState',
				'useEffect',
				'useContext',
				'useReducer',
				'useCallback',
				'useMemo',
				'useRef',
				'useLayoutEffect',
				'useImperativeHandle',
				'useDebugValue',
			],
		},
		{
			id: 5,
			name: 'Node.js',
			flashcards: [
				'require',
				'module',
				'exports',
				'import',
				'export',
				'import.meta',
				'process',
				'console',
				'fs',
				'path',
			],
		},
	]

	const { openModal } = useModal()

	const createNewSet = () => {
		openModal('create-set')
	}
</script>
