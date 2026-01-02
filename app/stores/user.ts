import { defineStore } from 'pinia'
import type { SupabaseUser, UserKey } from '~/types'

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
			// Note: Sets fetching is handled by pages via useSets composable
			// This keeps stores framework-agnostic and allows SSR
		},

		async loadUserSettings() {
			if (!this.userId) return

			// Only execute on client side where Nuxt context is available
			if (import.meta.server) {
				return
			}

			try {
				const supabase = useSupabaseClient()

				const { data, error } = await supabase
					.from('user_key')
					.select('api_key')
					.eq('user_id', this.userId)
					.single()

				if (!error && data) {
					this.userAiApiKey = (data as UserKey).api_key
				}
			} catch (err: unknown) {
				// No API key set yet or table doesn't exist - this is fine
				console.error('User API key not found:', err)
			}
		},

		async setGroqApiKey(key: string) {
			if (!this.userId) return

			const { startLoading, stopLoading } = useLoader()

			startLoading('save')
			this.userAiApiKey = key

			try {
				// Only execute on client side where Nuxt context is available
				if (import.meta.server) {
					throw new Error('Cannot save API key on server side')
				}

				console.log('Calling Supabase upsert...')

				const supabase = useSupabaseClient()

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const { error } = await (supabase.from('user_key') as any)
					.upsert({ user_id: this.userId, api_key: key })
					.select()

				if (error) {
					console.error('Supabase error:', error)
					throw error
				}

				console.log('API key saved successfully!')
			} catch (err) {
				console.error('Failed to save API key:', err)
				// Revert local state on error
				this.userAiApiKey = null
				throw err
			} finally {
				stopLoading()
			}
		},

		async logout() {
			// Only execute on client side where Nuxt context is available
			if (import.meta.server) {
				return
			}

			const supabase = useSupabaseClient()

			await supabase.auth.signOut()

			this.isAuthenticated = false
			this.userId = null
			this.userAiApiKey = null
			this.userEmail = null
		},
	},
})
