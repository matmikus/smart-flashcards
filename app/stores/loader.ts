import { defineStore } from 'pinia'

export type LoaderType = 'fetch' | 'ai' | 'save'

export interface LoaderState {
	isLoading: boolean
	type?: LoaderType
}

const loaderMessages: Record<LoaderType, string> = {
	fetch: 'Loading...',
	ai: 'AI thinking...',
	save: 'Saving...',
}

export const useLoaderStore = defineStore('loader', {
	state: (): LoaderState => ({
		isLoading: false,
		type: undefined,
	}),

	actions: {
		startLoading(type: LoaderType) {
			this.isLoading = true
			this.type = type
		},

		stopLoading() {
			this.isLoading = false
			this.type = undefined
		},

		getMessage(type?: LoaderType): string | undefined {
			return type ? loaderMessages[type] : undefined
		},
	},
})
