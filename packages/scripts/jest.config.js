const base = require('../../jest.base');
const pkg = require('./package.json');

module.exports = {
	...base,
	name: pkg.name,
	displayName: pkg.name,
	globals: {
		// These are needed to test the entrypoint
		// At this moment, it doesn't have any side-effect on anything else
		__WPACKIO__: {
			appName: 'foo',
			outputPath: 'bar',
		},
		__webpack_public_path__: '',
		window: {
			__wpackIofoobar: '/biz/baz',
		},
	},
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/@types/**',
		// For e2e
		'!src/bin/**',
		// End e2e
		'!**/node_modules/**',
		'!**/*.{spec|test}.ts',
		'!**/lib/**',
		'!**/babel.config.js',
	],
};
