import { useModalStore } from '~/stores/modal'

export const useModal = () => {
	const modalStore = useModalStore()

	return {
		modalState: computed(() => ({
			type: modalStore.type,
			props: modalStore.props,
		})),
		openModal: modalStore.openModal,
		closeModal: modalStore.closeModal,
		isOpen: modalStore.isOpen,
	}
}
