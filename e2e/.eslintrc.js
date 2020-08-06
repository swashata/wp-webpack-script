const rules = {
	'no-console': 'off',
	'no-param-reassign': 'off',
	'global-require': 'off',
	'no-shadow': 'off',
	'no-undef': 'off',
};

module.exports = {
	extends: ['@wpackio/eslint-config'],
	rules: {
		...rules,
	},
	overrides: [
		{
			files: ['**/*.ts', '**/*.tsx'],
			extends: ['@wpackio/eslint-config/ts'],
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: __dirname,
			},
			settings: {
				'import/resolver': {
					typescript: {
						directory: __dirname,
					},
				},
			},
			rules: {
				...rules,
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
		{
			files: ['**/cypress/**/*.js'],
			rules: {
				'spaced-comment': 'off',
				'jest/expect-expect': 'off',
				'jest/valid-expect': 'off',
				'jest/valid-expect-in-promise': 'off',
			},
		},
	],
};
