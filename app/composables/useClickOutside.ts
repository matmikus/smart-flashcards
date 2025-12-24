export const useClickOutside = (
	target: Ref<HTMLElement | null | undefined>,
	callback: () => void
) => {
	const handleClick = (event: MouseEvent) => {
		const element = target.value
		if (
			element &&
			event.target &&
			!(
				element === event.target ||
				element.contains(event.target as Node)
			)
		) {
			callback()
		}
	}

	onMounted(() => {
		document.addEventListener('click', handleClick)
	})

	onUnmounted(() => {
		document.removeEventListener('click', handleClick)
	})
}
