module.exports = {
	extends: ['@wpackio/eslint-config'],
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
				react: {
					version: '16.12',
				},
			},
			rules: {
				'no-console': 'off',
			},
		},
	],
};
