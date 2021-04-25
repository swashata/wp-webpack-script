// Copyright (c) 2018 Swashata Ghosh <swashata@wpquark.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Use this configuration for standard JavaScript Projects.

const rules = require('./config/rules');
const env = require('./config/env');
const ex = require('./config/extends');

module.exports = {
	env,
	extends: [...ex, 'plugin:prettier/recommended'],
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 2018,
		ecmaFeatures: {
			jsx: true,
		},
		sourceType: 'module',
	},
	plugins: ['babel', 'react-hooks'],
	rules: {
		...rules,
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
		'no-unused-vars': 'warn',
	},
};
