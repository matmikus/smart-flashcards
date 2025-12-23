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

		setOpenaiApiKey(key: string) {
			this.userAiApiKey = key
			console.log('setOpenaiApiKey', key)
			console.log('setOpenaiApiKey', this.userAiApiKey)
		},

		logout() {
			this.isAuthenticated = false
			this.userId = null
			this.userAiApiKey = null
		},
	},
})
