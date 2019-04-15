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
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended',
		...ex,
		'prettier/@typescript-eslint',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['babel'],
	rules: {
		...rules,
		// typescript specific rules
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
	},
};
