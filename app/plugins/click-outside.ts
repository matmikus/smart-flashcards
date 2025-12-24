export default defineNuxtPlugin((nuxtApp) => {
	// Register a stub directive for SSR
	nuxtApp.vueApp.directive('click-outside', {
		getSSRProps() {
			// Return empty props for SSR since this directive is client-only
			return {}
		},
	})
})
