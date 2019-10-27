// Copyright (c) 2018 Swashata Ghosh <swashata@wpquark.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Use this configuration for standard TypeScript Projects.

const rules = require('./config/rules');
const env = require('./config/env');
const ex = require('./config/extends');

module.exports = {
	env,
	extends: [
		...ex,
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'prettier/react',
		'prettier/@typescript-eslint',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['babel'],
	rules: {
		...rules,
		// turn off react prop-types because we will be using typescript
		'react/prop-types': 'off',
		'react/require-default-props': 'off',
		'react/default-props-match-prop-types': 'off',
		'react/no-unused-prop-types': 'off',
		// typescript specific rules
		'@typescript-eslint/prefer-interface': 'off',
		'import/prefer-default-export': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
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
	},
};
