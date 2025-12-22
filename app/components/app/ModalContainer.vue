<template>
	<AppModal
		v-if="isCreateSetOpen"
		v-model="isCreateSetOpen"
		title="Create New Set"
		@update:model-value="closeModal"
	>
		<SetGenerator />
	</AppModal>

	<AppModal
		v-if="isSetSettingsOpen"
		v-model="isSetSettingsOpen"
		title="Set Settings"
		@update:model-value="closeModal"
	>
		<SetSettings :set="set" />
	</AppModal>

	<AppModal
		v-if="isSetDeletionOpen"
		v-model="isSetDeletionOpen"
		title="Set Deletion"
		@update:model-value="closeModal"
	>
		<SetDeletion :set="set" />
	</AppModal>
</template>

<script setup lang="ts">
	import type { Set } from '@/types'

	const { modalState, closeModal } = useModal()

	const set = computed(() => modalState.value.props?.set as Set)

	const isCreateSetOpen = computed({
		get: () => modalState.value.type === 'create-set',
		set: () => closeModal(),
	})

	const isSetSettingsOpen = computed({
		get: () => modalState.value.type === 'set-settings',
		set: () => closeModal(),
	})

	const isSetDeletionOpen = computed({
		get: () => modalState.value.type === 'set-deletion',
		set: () => closeModal(),
	})

	// Debug: log modal state changes
	watch(
		() => modalState.value.type,
		(newType) => {
			console.log('Modal type changed:', newType)
		}
	)
</script>
