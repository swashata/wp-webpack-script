const base = require('../../jest.base');
const pkg = require('./package.json');

module.exports = {
	...base,
	name: pkg.name,
	displayName: pkg.name,
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/@types/**',
		// For e2e
		'!src/bin/**',
		'!src/scripts/**',
		// End e2e
		'!**/node_modules/**',
		'!**/*.{spec|test}.ts',
		'!**/lib/**',
		'!**/babel.config.js',
	],
};
