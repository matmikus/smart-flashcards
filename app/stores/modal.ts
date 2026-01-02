import { defineStore } from 'pinia'

export type ModalType = 'create-set' | 'set-settings' | 'set-deletion' | null

export interface ModalState {
	type: ModalType
	props?: Record<string, unknown>
}

export const useModalStore = defineStore('modal', {
	state: (): ModalState => ({
		type: null,
		props: {},
	}),

	actions: {
		openModal(type: ModalType, props?: Record<string, unknown>) {
			this.type = type
			this.props = props || {}
		},

		closeModal() {
			this.type = null
			this.props = {}
		},

		isOpen(type: ModalType) {
			return this.type === type
		},
	},
})
