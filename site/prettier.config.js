// eslint-disable-next-line import/no-extraneous-dependencies
const wpack = require('@wpackio/eslint-config/prettier.config');

module.exports = {
	...wpack,
	proseWrap: 'always',
};
