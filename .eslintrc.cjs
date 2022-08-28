module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'eslint-config-prettier', 'prettier'],
	plugins: ['prettier'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	root: true,
	ignorePatterns: ['.eslintrc.cjs'],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'no-console': ['off'],
		'no-unused-vars': ['error'],
		'prettier/prettier': ['error'],
		'max-params': ['warn', 6],
		'no-unused-vars': ['error', { args: 'none' }],
		'no-var': 'error',
	},
};
