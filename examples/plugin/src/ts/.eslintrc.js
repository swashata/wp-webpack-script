const path = require('path');

module.exports = {
	extends: ['@wpackio/eslint-config/ts'],
	parserOptions: {
		project: path.resolve(__dirname, '../../tsconfig.json'),
		tsconfigRootDir: path.resolve(__dirname, '../../'),
	},
	settings: {
		'import/resolver': {
			typescript: {
				directory: path.resolve(__dirname, '../../'),
			},
		},
	},
};
