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
	// ===================================
	// Some rules from eslint-plugin-babel
	// ===================================
	// First turn them off
	'new-cap': 'off',
	camelcase: 'off',
	'no-invalid-this': 'off',
	'object-curly-spacing': 'off',
	semi: 'off',
	'no-unused-expressions': 'off',
	'valid-typeof': 'off',
	// require a capital letter for constructors
	'babel/new-cap': [
		'error',
		{
			newIsCap: true,
			newIsCapExceptions: [],
			capIsNew: false,
			capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
		},
	],
	// require camel case names
	// This one is enhanced from airbnb and accounts for destructuring
	// and react UNSAFE_component* methods.
	'babel/camelcase': [
		'error',
		{
			properties: 'never',
			ignoreDestructuring: true,
		},
	],
	// We would force invalid this rules
	// But would only warn about it
	'babel/no-invalid-this': 'warn',
	// We don't configure curly spacing because of prettier
	'babel/object-curly-spacing': 'off',
	// We don't configure babel/semi because of prettier
	'babel/semi': 'off',
	// disallow usage of expressions in statement position
	'babel/no-unused-expressions': [
		'error',
		{
			allowShortCircuit: false,
			allowTernary: false,
			allowTaggedTemplates: false,
		},
	],
	// ensure that the results of typeof are compared against a valid string
	// https://eslint.org/docs/rules/valid-typeof
	'babel/valid-typeof': ['error', { requireStringLiterals: true }],
	'no-unused-vars': 'warn',
};
