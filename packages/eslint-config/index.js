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
	},
};
