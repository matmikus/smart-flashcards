// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@pinia/nuxt',
		'@nuxt/test-utils',
		'@nuxt/eslint',
		'@nuxtjs/tailwindcss',
		'@nuxtjs/google-fonts',
		'@nuxtjs/supabase',
	],
	runtimeConfig: {
		public: {
			groqApiKey: process.env.GROQ_API_KEY || '',
		},
	},
	supabase: {
		redirect: true, // Enabled by default
		redirectOptions: {
			login: '/login',
			callback: '/',
			exclude: ['/login'], // Routes that don't require auth
		},
	},
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	compatibilityDate: '2025-07-15',
	nitro: {
		preset: 'vercel',
	},
	vite: {
		server: {
			hmr: {
				overlay: true, // Show errors in browser
			},
		},
		build: {
			// Minification
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: false, // No need to remove console.log in production
					drop_debugger: true,
				},
			},
			// Chunk size warnings threshold
			chunkSizeWarningLimit: 1000,
		},
		// CSS optimization
		css: {
			devSourcemap: false, // Disable sourcemaps in production
		},
		// Optimize dependencies
		optimizeDeps: {
			include: ['vue', 'vue-router'],
		},
	},
	eslint: {
		checker: true,
	},
	googleFonts: {
		families: {
			SpaceGrotesk: [400, 700],
			'BBH Bartle': [400],
		},
	},
})
