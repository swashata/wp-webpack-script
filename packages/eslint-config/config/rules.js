// Default sets of rules for ESLint

module.exports = {
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
			capIsNewExceptions: [
				'Immutable.Map',
				'Immutable.Set',
				'Immutable.List',
			],
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
	'react/no-unused-prop-types': 1,
	'react/no-unused-state': 1,
	'no-unused-vars': 1,
	'prettier/prettier': ['error'],
	'no-console': 0,
	'no-plusplus': [
		2,
		{
			allowForLoopAfterthoughts: true,
		},
	],
};
