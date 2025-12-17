// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxt/test-utils', '@nuxt/eslint', '@nuxtjs/tailwindcss'],
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	compatibilityDate: '2025-07-15',
	eslint: {
		checker: true,
	},
})
