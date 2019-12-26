// Default sets of rules for ESLint

module.exports = {
	'react/no-unused-prop-types': 'warn',
	'react/no-unused-state': 'warn',
	'prettier/prettier': ['error'],
	'no-console': 'warn',
	'no-plusplus': [
		'error',
		{
			allowForLoopAfterthoughts: true,
		},
	],
	'react/jsx-filename-extension': 'off',
	'react-hooks/rules-of-hooks': 'error',
	'react-hooks/exhaustive-deps': 'warn',
	'react/destructuring-assignment': 'off',
	'no-nested-ternary': 'off',
	'max-classes-per-file': 'off',
	eqeqeq: ['error', 'smart'],
	'prefer-destructuring': 'off',
	'func-names': 'off',
	'lines-between-class-members': 'off',
	'import/extensions': ['error', 'never'],
};
