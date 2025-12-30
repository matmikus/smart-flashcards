export default defineNuxtRouteMiddleware((to) => {
	const storeUser = useUserStore()

	if (!storeUser.isAuthenticated && to.path !== '/login') {
		return navigateTo('/login')
	} else if (storeUser.isAuthenticated && to.path === '/login') {
		return navigateTo('/')
	}
})
