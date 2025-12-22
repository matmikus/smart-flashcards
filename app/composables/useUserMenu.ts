export const useUserMenu = () => {
	const isOpen = useState<boolean>('userMenu', () => false)

	const toggle = () => {
		isOpen.value = !isOpen.value
	}

	return {
		isOpen: readonly(isOpen),
		toggle,
	}
}
