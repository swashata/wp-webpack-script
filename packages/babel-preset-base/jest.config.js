const base = require('../../jest.base');
const package = require('./package.json');

module.exports = {
	...base,
	name: package.name,
	displayName: package.name,
};
