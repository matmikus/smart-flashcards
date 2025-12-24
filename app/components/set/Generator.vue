<template>
	<div class="p-4">
		<h1 class="text-white mb-6 text-xl font-bold">Create New Set</h1>
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
					v-model="formData.setName"
					type="text"
					class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					placeholder="Enter set name"
					required
				/>
			</div>

			<!-- AI Generated Toggle -->
			<div class="flex items-center gap-3">
				<label
					for="ai-generated"
					class="text-white font-semibold cursor-pointer"
				>
					AI Generated Items
				</label>
				<button
					id="ai-generated"
					type="button"
					:class="[
						'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
						formData.isAiGenerated
							? 'bg-indigo-600'
							: 'bg-slate-600',
					]"
					@click="formData.isAiGenerated = !formData.isAiGenerated"
				>
					<span
						:class="[
							'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
							formData.isAiGenerated
								? 'translate-x-6'
								: 'translate-x-1',
						]"
					/>
				</button>
			</div>

			<!-- Conditional Content -->
			<div v-if="!formData.isAiGenerated" class="space-y-4">
				<!-- Manual Items List -->
				<div>
					<label class="block text-white mb-2 font-semibold">
						Items
					</label>
					<div class="space-y-2 max-h-[300px] overflow-y-auto">
						<div
							v-for="(item, index) in formData.items"
							:key="index"
							class="flex gap-2 items-center"
						>
							<input
								v-model="formData.items[index]"
								type="text"
								class="flex-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
								:placeholder="`Item ${index + 1}`"
							/>
							<button
								type="button"
								class="p-2 text-red-400 hover:text-red-300 transition-colors"
								:disabled="formData.items.length === 1"
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
						class="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
						@click="addItem"
					>
						+ Add Item
					</button>
				</div>
			</div>

			<div v-else class="space-y-4">
				<!-- AI Generation Textarea -->
				<div>
					<label
						for="ai-topic"
						class="block text-white mb-2 font-semibold"
					>
						Describe Topic for AI
					</label>
					<textarea
						id="ai-topic"
						v-model="formData.aiTopic"
						rows="4"
						class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
						placeholder="Describe topic for AI here"
					/>
				</div>
				<div>
					<label
						for="ai-amount"
						class="block text-white mb-2 font-semibold"
					>
						Number of Items
					</label>
					<input
						id="ai-amount"
						v-model="formData.aiAmount"
						type="number"
						class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="Enter number of items"
					/>
				</div>
				<button
					type="button"
					class="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-semibold"
					@click="generateByAI"
				>
					Generate by AI
				</button>
			</div>

			<!-- Submit Button -->
			<div class="pt-4 border-t border-slate-700">
				<button
					type="submit"
					class="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-semibold"
				>
					Create Set
				</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
	const { error, success } = useToast()
	const { startLoading, stopLoading } = useLoader()
	const { closeModal } = useModal()

	const setsStore = useSetsStore()
	const userStore = useUserStore()

	const formData = reactive({
		setName: '',
		isAiGenerated: true,
		aiAmount: 10,
		items: [''],
		aiTopic: '',
	})

	const addItem = () => {
		formData.items.push('')
	}

	const removeItem = (index: number) => {
		if (formData.items.length > 1) {
			formData.items.splice(index, 1)
		}
	}

	const generateByAI = async () => {
		if (!formData.aiTopic.trim()) {
			error('Please describe the topic for AI generation')
			return
		}

		startLoading('ai')
		try {
			const response = await fetch(
				'https://api.groq.com/openai/v1/chat/completions',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${userStore.getUserAiApiKey}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						model: 'openai/gpt-oss-20b',
						messages: [
							{
								role: 'user',
								content: `Generate ${formData.aiAmount} flashcard topic-items to learn about: ${formData.aiTopic}. Return only the quoted items in a comma separated array, no other text.`,
							},
						],
					}),
				}
			)

			const data = await response.json()

			const content = data?.choices[0]?.message?.content
			const dataObj = {
				items: JSON.parse(content),
			} as { items: string[] }

			formData.items = dataObj.items
			success('Items generated successfully!')
		} catch (err) {
			console.error('Fetch Error:', err)
			error('Failed to connect to AI service')
		} finally {
			stopLoading()
		}
	}

	const handleSubmit = async () => {
		if (!formData.setName.trim()) {
			error('Please enter a set name')
			return
		}

		const validItems = formData.items.filter((item) => item.trim())
		if (validItems.length === 0) {
			error('Please add at least one item')
			return
		}

		setsStore.addSet(formData.setName, validItems)
		closeModal()
	}
</script>
