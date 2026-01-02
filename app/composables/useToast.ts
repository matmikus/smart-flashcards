import { useToastStore } from '~/stores/toast'
export type { ToastType, Toast } from '~/stores/toast'
export { useToastStore } from '~/stores/toast'

export const useToast = () => {
	const toastStore = useToastStore()

	return {
		toasts: computed(() => toastStore.toasts),
		showToast: toastStore.showToast,
		removeToast: toastStore.removeToast,
		success: toastStore.success,
		error: toastStore.error,
		warning: toastStore.warning,
		info: toastStore.info,
	}
}
