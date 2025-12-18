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
		<SetSettings :set="modalState.props?.set" />
	</AppModal>

	<AppModal
		v-if="isSetStatsOpen"
		v-model="isSetStatsOpen"
		title="Set Statistics"
		@update:model-value="closeModal"
	>
		<SetStats :set="modalState.props?.set" />
	</AppModal>
</template>

<script setup lang="ts">
const { modalState, closeModal } = useModal()

const isCreateSetOpen = computed({
	get: () => modalState.value.type === 'create-set',
	set: () => closeModal(),
})

const isSetSettingsOpen = computed({
	get: () => modalState.value.type === 'set-settings',
	set: () => closeModal(),
})

const isSetStatsOpen = computed({
	get: () => modalState.value.type === 'set-stats',
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