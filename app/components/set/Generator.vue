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
					aria-required="true"
					class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					placeholder="Enter set name"
					required
				/>
			</div>

			<div class="space-y-4">
				<!-- AI Generation Textarea -->
				<div>
					<label
						for="ai-topic"
						class="block text-white mb-2 font-semibold"
					>
						Describe Topic for AI (and context of learning)
					</label>
					<textarea
						id="ai-topic"
						v-model="formData.aiTopic"
						rows="4"
						aria-describedby="ai-topic-help"
						class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
						placeholder="Describe topic for AI here"
					/>
					<span id="ai-topic-help" class="sr-only">
						Describe the topic and learning context for AI to
						generate flashcard items
					</span>
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
						min="1"
						max="50"
						aria-describedby="ai-amount-help"
						class="w-full p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="Enter number of items"
					/>
					<span id="ai-amount-help" class="sr-only">
						Number of flashcard items to generate (1-50)
					</span>
				</div>
				<button
					type="button"
					aria-label="Generate flashcard items using AI"
					class="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
					@click="generateByAI"
				>
					Generate by AI
				</button>
				<div class="text-white/70 text-sm">
					Or add/edit items manually
				</div>
			</div>

			<!-- Items List -->
			<div class="space-y-4">
				<div>
					<label class="block text-white mb-2 font-semibold">
						Items
					</label>
					<div
						ref="itemsList"
						class="space-y-2 max-h-[300px] overflow-y-auto"
						role="list"
						aria-label="Flashcard items"
					>
						<div
							v-for="(item, index) in formData.items"
							:key="index"
							class="flex gap-2 items-center"
							role="listitem"
						>
							<label :for="`item-${index}`" class="sr-only">
								Item {{ index + 1 }}
							</label>
							<input
								:id="`item-${index}`"
								v-model="formData.items[index]"
								type="text"
								class="flex-1 m-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
								:placeholder="`Item ${index + 1}`"
							/>
							<button
								type="button"
								:aria-label="`Remove item ${index + 1}`"
								:disabled="formData.items.length === 1"
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
						type="button"
						aria-label="Add new item"
						class="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
						@click="addItem"
					>
						+ Add Item
					</button>
				</div>
			</div>

			<!-- Submit Button -->
			<div class="pt-4 border-t border-slate-700">
				<button
					type="submit"
					class="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

	const itemsList = ref<HTMLDivElement | null>(null)

	const formData = reactive({
		setName: '',
		aiAmount: 10,
		items: [''],
		aiTopic: '',
	})

	const addItem = () => {
		formData.items.push('')
		itemsList.value?.scrollTo({
			top: itemsList.value?.scrollHeight,
			behavior: 'smooth',
		})
	}

	const removeItem = (index: number) => {
		if (formData.items.length > 1) {
			formData.items.splice(index, 1)
		}
	}

	const generateByAI = async () => {
		if (!formData.aiTopic.trim()) {
			error('Please describe the topic for AI')
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
								content: `Generate ${formData.aiAmount} flashcard topic-items to learn about: "${formData.aiTopic}". Try to think like a teacher or recruiter, trying to verify if the student/interviewer knows the topic. Try to pick all important topics, in context of the given area. Return only the quoted items in a comma separated array, no other text. Items should be in same language as the given topic. Items should be just short words or phrases, not sentences, not questions (questions will be generated by AI later from these items).`,
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

		setsStore.addSet({
			name: formData.setName,
			description: formData.aiTopic,
			items: validItems,
		})
		closeModal()
	}
</script>
