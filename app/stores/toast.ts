import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
	id: string
	message: string
	type: ToastType
	duration?: number
}

export const useToastStore = defineStore('toast', {
	state: () => ({
		toasts: [] as Toast[],
	}),

	actions: {
		showToast(
			message: string,
			type: ToastType = 'info',
			duration: number = 3000
		) {
			const id =
				Date.now().toString() + Math.random().toString(36).substr(2, 9)
			const toast: Toast = {
				id,
				message,
				type,
				duration,
			}

			this.toasts.push(toast)

			// Auto-remove after duration (client-side only)
			if (import.meta.client) {
				setTimeout(() => {
					this.removeToast(id)
				}, duration)
			}

			return id
		},

		removeToast(id: string) {
			const index = this.toasts.findIndex((t) => t.id === id)
			if (index > -1) {
				this.toasts.splice(index, 1)
			}
		},

		success(message: string, duration?: number) {
			return this.showToast(message, 'success', duration)
		},

		error(message: string, duration?: number) {
			return this.showToast(message, 'error', duration)
		},

		warning(message: string, duration?: number) {
			return this.showToast(message, 'warning', duration)
		},

		info(message: string, duration?: number) {
			return this.showToast(message, 'info', duration)
		},
	},
})
