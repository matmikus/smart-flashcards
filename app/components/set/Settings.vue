<template>
	<div>
		<h1 :class="[cardColor.textColor]">Set settings</h1>
		<div class="min-h-[300px] mt-4">
			<form class="space-y-6" @submit.prevent="handleSubmit">
				<!-- Set Name Input -->
				<div>
					<label
						for="set-name"
						class="block text-white mb-2 font-semibold"
					>
						Set Name
					</label>
					<input
						id="set-name"
						v-model="localSet.name"
						type="text"
						class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="Enter set name"
						required
					/>
				</div>
				<div class="space-y-4">
					<div>
						<div class="flex items-center gap-2 justify-between">
							<label class="block text-white font-semibold">
								Items
							</label>
							<button
								type="button"
								class="mb-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
								@click="addItem"
							>
								Add Item
							</button>
						</div>
						<div class="space-y-2 max-h-[300px] overflow-y-auto">
							<div
								v-for="(item, index) in localSet.flashcards"
								:key="index"
								class="flex gap-2 items-center"
							>
								<input
									v-model="localSet.flashcards[index]"
									type="text"
									class="flex-1 p-2 m-1 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
									:placeholder="`Item ${index + 1}`"
								/>
								<button
									type="button"
									class="p-2 text-red-400 hover:text-red-300 transition-colors"
									:disabled="localSet.flashcards.length === 1"
									@click="removeItem(index)"
								>
									<svg
										class="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						</div>
						<button
							type="button"
							class="w-full mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
							@click="addItem"
						>
							Save
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { Set } from '@/types'

	const props = defineProps<{
		set: Set
	}>()

	const cardColor = computed(() => {
		return cardColors[props.set.color]!
	})

	const localSet = ref<Set>({
		...props.set,
		flashcards: [...props.set.flashcards],
	})

	const handleSubmit = () => {
		console.log('handleSubmit')
	}

	const addItem = () => {
		localSet.value.flashcards.push('')
	}

	const removeItem = (index: number) => {
		localSet.value.flashcards.splice(index, 1)
	}
</script>
