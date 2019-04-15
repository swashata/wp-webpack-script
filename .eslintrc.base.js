module.exports = {
	extends: [
		'@wpquark',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'prettier/@typescript-eslint',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	rules: {
		'import/prefer-default-export': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'class-methods-use-this': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'import/no-cycle': 'off',
		'import/no-dynamic-require': 'off',
		'import/named': 'off',
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				directory: __dirname,
			},
		},
	},
};
