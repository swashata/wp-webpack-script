const base = require('../../jest.base');
const pkg = require('./package.json');

module.exports = {
	...base,
	name: pkg.name,
	displayName: pkg.name,
};
