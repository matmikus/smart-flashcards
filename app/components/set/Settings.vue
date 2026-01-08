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
						aria-required="true"
						class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="Enter set name"
						required
					/>
				</div>

				<!-- AI Description Input -->
				<div>
					<label
						for="set-description"
						class="block text-white mb-2 font-semibold"
					>
						AI Description
					</label>
					<textarea
						id="set-description"
						v-model="localSet.description"
						rows="4"
						aria-describedby="set-description-help"
						class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
						placeholder="Describe the topic and context for AI (used when generating explanations)"
					/>
					<span id="set-description-help" class="sr-only">
						Optional description used by AI when generating
						explanations
					</span>
				</div>
				<div class="space-y-4">
					<div>
						<div class="flex items-center gap-2 justify-between">
							<label class="block text-white font-semibold">
								Items
							</label>
							<button
								type="button"
								aria-label="Add new item"
								class="mb-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
								@click="addItem"
							>
								Add Item
							</button>
						</div>
						<div
							class="space-y-2 max-h-[300px] overflow-y-auto"
							role="list"
							aria-label="Flashcard items"
						>
							<div
								v-for="(item, index) in localSet.topics"
								:key="index"
								class="flex gap-2 items-center"
								role="listitem"
							>
								<label :for="`item-${index}`" class="sr-only">
									Item {{ index + 1 }}
								</label>
								<input
									:id="`item-${index}`"
									v-model="localSet.topics[index]"
									type="text"
									class="flex-1 p-2 m-1 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
									:placeholder="`Item ${index + 1}`"
								/>
								<button
									type="button"
									:aria-label="`Remove item ${index + 1}`"
									:disabled="localSet.topics.length === 1"
									class="p-2 text-red-400 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
									@click="removeItem(index)"
								>
									<svg
										class="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
									<span class="sr-only">Remove</span>
								</button>
							</div>
						</div>
						<button
							type="submit"
							class="w-full mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
							@click="handleSubmit"
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

	const setStore = useSetsStore()

	const { closeModal } = useModal()

	const cardColor = computed(() => {
		return cardColors[props.set.color]!
	})

	const localSet = ref<Set>({
		...props.set,
		topics: [...props.set.topics],
	})

	const handleSubmit = () => {
		const parsedSet = {
			...localSet.value,
			topics: localSet.value.topics.filter((item) => item.trim()),
		}

		setStore.updateSet(props.set.id, parsedSet).then(() => {
			closeModal()
		})
	}

	const addItem = () => {
		localSet.value.topics.push('')
	}

	const removeItem = (index: number) => {
		localSet.value.topics.splice(index, 1)
	}
</script>
