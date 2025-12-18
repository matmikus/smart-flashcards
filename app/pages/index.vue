<template>
	<div>
		<div class="flex justify-between items-center mb-4">
			<h1
				class="mb-4 text-white font-bold text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
			>
				Your Sets
			</h1>
			<button
				class="bg-purple-500 text-white p-2 rounded-md font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-400/50 hover:bg-purple-400 transition-all border border-purple-400/50"
				@click="createNewSet"
			>
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
			color: 0,
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
			color: 1,
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
			color: 2,
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
			color: 3,
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
			color: 4,
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
