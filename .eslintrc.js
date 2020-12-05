module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2020: true,
	},
	extends: [
		'eslint:recommended',
		'airbnb-base',
		'plugin:react/recommended',
	],
	parserOptions: {
		ecmaVersion: 11,
	},
	rules: {
		'no-console': 'off',
		'linebreak-style': ['error', 'windows'],
		indent: ['error', 'tab'],
		'no-tabs': ['error', { allowIndentationTabs: true }],
		'import/extensions': ['error', 'always'],
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
	},
};
