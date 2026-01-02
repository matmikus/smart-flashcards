export default defineNuxtPlugin(async () => {
	const user = useSupabaseUser()
	const userStore = useUserStore()

	// Initialize user if already logged in (works on both server and client)
	if (user.value) {
		// On client side, ensure context is ready before calling store actions
		if (import.meta.client) {
			await nextTick()
		}
		await userStore.initializeUser(user.value)
	}

	// Watch for auth state changes (client-side only)
	if (import.meta.client) {
		const supabase = useSupabaseClient()

		// Watch Supabase user changes
		watch(user, async (newUser) => {
			if (newUser) {
				userStore.initializeUser(newUser)
			} else {
				userStore.isAuthenticated = false
				userStore.userId = null
				userStore.userAiApiKey = null
				userStore.userEmail = null
			}
		})

		// Listen for auth state changes
		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_IN' && session?.user) {
				userStore.initializeUser(session.user)
			} else if (event === 'SIGNED_OUT') {
				userStore.isAuthenticated = false
				userStore.userId = null
				userStore.userAiApiKey = null
				userStore.userEmail = null
			}
		})
	}
})
