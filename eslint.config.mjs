import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(
	{
		rules: {
			// Disable @stylistic/indent globally first
			'@stylistic/indent': 'off',
			// Vue script indentation - baseIndent: 1 allows 4 spaces inside script tag
			'vue/script-indent': [
				'error',
				4,
				{
					baseIndent: 1,
					switchCase: 1,
					ignores: [],
				},
			],
			// Vue template indentation
			'vue/html-indent': [
				'error',
				4,
				{
					attribute: 1,
					baseIndent: 1,
					closeBracket: 0,
					alignAttributesVertically: true,
					ignores: [],
				},
			],
		},
	},
	{
		files: ['**/*.{js,ts,jsx,tsx}'],
		rules: {
			// Re-enable @stylistic/indent for non-Vue files
			'@stylistic/indent': ['error', 4],
		},
	},
	prettier
)
