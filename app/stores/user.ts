import { defineStore } from 'pinia'
import type { SupabaseUser } from '~/types'

export const useUserStore = defineStore('user', {
	state: () => ({
		isAuthenticated: false,
		userId: null as string | null,
		userAiApiKey: null as string | null,
		userEmail: null as string | null,
	}),

	getters: {
		getUserAiApiKey: (state) => {
			return state.userAiApiKey
		},
		getUserEmail: (state) => state.userEmail,
	},

	actions: {
		async initializeUser(supabaseUser: SupabaseUser) {
			this.isAuthenticated = true

			// Extract user ID: User objects have 'id', JWT payloads have 'sub'
			if ('id' in supabaseUser && supabaseUser.id) {
				this.userId = supabaseUser.id
			} else if ('sub' in supabaseUser && supabaseUser.sub) {
				this.userId = supabaseUser.sub
			} else {
				this.userId = null
			}

			this.userEmail = supabaseUser.email || null

			await this.loadUserSettings()
		},

		async loadUserSettings() {
			if (!this.userId || import.meta.server) return

			// const supabase = useSupabaseClient()

			// try {
			// 	const { data, error } = await supabase
			// 		.from('user_settings')
			// 		.select('groq_api_key')
			// 		.eq('user_id', this.userId)
			// 		.single()

			// 	if (!error && data?.groq_api_key) {
			// 		this.userAiApiKey = data.groq_api_key
			// 	}
			// } catch (err) {
			// 	// Table might not exist yet, ignore
			// }
		},

		async setGroqApiKey(key: string) {
			if (!this.userId || import.meta.server) return

			const { startLoading, stopLoading } = useLoader()
			// const supabase = useSupabaseClient()

			startLoading('save')
			this.userAiApiKey = key

			try {
				// const { error } = await supabase.from('user_settings').upsert({
				// 	user_id: this.userId,
				// 	groq_api_key: key,
				// })
				// if (error) throw error
			} catch (err) {
				console.error('Failed to save API key:', err)
			} finally {
				stopLoading()
			}
		},

		async logout() {
			const supabase = useSupabaseClient()

			await supabase.auth.signOut()

			this.isAuthenticated = false
			this.userId = null
			this.userAiApiKey = null
			this.userEmail = null
		},
	},
})
