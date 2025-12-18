export type ModalType = 'create-set' | 'set-settings' | 'set-stats' | null

export interface ModalState {
	type: ModalType
	props?: Record<string, unknown>
}

export const useModal = () => {
	const modalState = useState<ModalState>('modal', () => ({
		type: null,
		props: {},
	}))

	const openModal = (type: ModalType, props?: Record<string, unknown>) => {
		modalState.value = {
			type,
			props: props || {},
		}
	}

	const closeModal = () => {
		modalState.value = {
			type: null,
			props: {},
		}
	}

	const isOpen = (type: ModalType) => {
		return modalState.value.type === type
	}

	return {
		modalState: readonly(modalState),
		openModal,
		closeModal,
		isOpen,
	}
}