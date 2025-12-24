import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useUserStore = defineStore('user', {
	state: () => ({
		isAuthenticated: false,
		userId: null as string | null,
		userAiApiKey: null as string | null,
		userName: null as string | null,
	}),

	getters: {
		getUserAiApiKey: (state) => state.userAiApiKey,
		getUserName: (state) => state.userName,
	},

	actions: {
		setUser(userData: User) {
			this.isAuthenticated = true
			this.userId = userData.id
			this.userAiApiKey = userData.key
			this.userName = userData.name
		},

		async setGroqApiKey(key: string) {
			const { startLoading, stopLoading } = useLoader()

			startLoading('save')
			this.userAiApiKey = key

			// TODO: Implement actual API call to save the key
			await new Promise((resolve) => setTimeout(resolve, 1000))

			stopLoading()
		},

		logout() {
			// TODO: Implement actual API call to logout
		},
	},
})
