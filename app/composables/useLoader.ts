import { useLoaderStore } from '~/stores/loader'

export const useLoader = () => {
	const loaderStore = useLoaderStore()

	return {
		loaderState: computed(() => ({
			isLoading: loaderStore.isLoading,
			type: loaderStore.type,
		})),
		startLoading: loaderStore.startLoading,
		stopLoading: loaderStore.stopLoading,
		getMessage: loaderStore.getMessage,
		isLoading: computed(() => loaderStore.isLoading),
	}
}
