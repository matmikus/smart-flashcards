<template>
	<div>
		<h1 :class="[cardColor.textColor]">Set stats</h1>
		<div class="min-h-[300px]"></div>
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
</script>
