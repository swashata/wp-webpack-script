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
};
