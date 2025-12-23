export type LoaderType = 'fetch' | 'ai'

export interface LoaderState {
	isLoading: boolean
	type?: LoaderType
}

const loaderMessages: Record<LoaderType, string> = {
	fetch: 'Loading...',
	ai: 'AI thinking...',
}

export const useLoader = () => {
	const loaderState = useState<LoaderState>('loader', () => ({
		isLoading: false,
		type: undefined,
	}))

	const startLoading = (type: LoaderType) => {
		loaderState.value = {
			isLoading: true,
			type,
		}
	}

	const stopLoading = () => {
		loaderState.value = {
			isLoading: false,
			type: undefined,
		}
	}

	const getMessage = (type?: LoaderType): string | undefined => {
		return type ? loaderMessages[type] : undefined
	}

	return {
		loaderState: readonly(loaderState),
		startLoading,
		stopLoading,
		getMessage,
		isLoading: computed(() => loaderState.value.isLoading),
	}
}

