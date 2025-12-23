export const useUserMenu = () => {
	const isOpen = useState<boolean>('userMenu', () => false)

	const toggle = () => {
		isOpen.value = !isOpen.value
	}

	const close = () => {
		isOpen.value = false
	}

	return {
		isOpen: readonly(isOpen),
		toggle,
		close,
	}
}
