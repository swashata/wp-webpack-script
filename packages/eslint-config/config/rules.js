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
};
