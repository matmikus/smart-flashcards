import { useUserMenuStore } from '~/stores/userMenu'

export const useUserMenu = () => {
	const userMenuStore = useUserMenuStore()

	return {
		isOpen: computed(() => userMenuStore.isOpen),
		toggle: userMenuStore.toggle,
		open: userMenuStore.open,
		close: userMenuStore.close,
	}
}
