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
		userAiApiKey: (state) => state.userAiApiKey,
		userName: (state) => state.userName,
	},

	actions: {
		setUser(userData: User) {
			this.isAuthenticated = true
			this.userId = userData.id
			this.userAiApiKey = userData.key
			this.userName = userData.name
		},

		logout() {
			this.isAuthenticated = false
			this.userId = null
			this.userAiApiKey = null
		},
	},
})
