/** @type {import('tailwindcss').Config} */
export default {
	// Nuxt UI handles content scanning, but you can extend it
	content: ['./app/**/*.{js,vue,ts}', './components/**/*.{js,vue,ts}'],
	theme: {
		extend: {
			fontFamily: {
				'space-grotesk': ['Space Grotesk', 'sans-serif'],
				'bbh-bartle': ['BBH Bartle', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
