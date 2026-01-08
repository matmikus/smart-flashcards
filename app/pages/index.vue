<template>
	<div>
		<div class="flex justify-between items-center mb-4 w-full md:w-auto">
			<h1
				class="mb-4 mr-4 text-white font-bold text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
			>
				Your Sets
			</h1>
			<button
				class="bg-slate-800 text-white p-2 rounded-md font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-400/50 hover:bg-purple-400 transition-all border border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
				aria-label="Create a new flashcard set"
				@click="createNewSet"
			>
				Create New Set
			</button>
		</div>
		<section
			aria-label="Your flashcard sets"
			class="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			<SetCard
				v-for="(set, index) in sets"
				:key="set.id"
				:index="index"
				:set="set"
			/>
			<p v-if="sets.length === 0" class="text-white/70">
				No sets found. Create your first set to get started!
			</p>
		</section>
	</div>
</template>

<script setup lang="ts">
	const { sets, fetchSets } = useSets()
	const { openModal } = useModal()

	// Fetch on server and client, await ensures SSR
	await useAsyncData('sets', async () => {
		await fetchSets()
		return { fetched: true }
	})

	const createNewSet = () => {
		openModal('create-set')
	}
</script>
