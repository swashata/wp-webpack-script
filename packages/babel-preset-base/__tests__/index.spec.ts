import { mockedApi } from '../__mocks__/@babel/helper-plugin-utils';
const wpwBabelPresetBase = require('../src/index');

describe('@wpackio/babel-preset-base', () => {
	test('checks for babel 7', () => {
		wpwBabelPresetBase({}, undefined, __dirname);
		expect(mockedApi.assertVersion).toHaveBeenLastCalledWith(7);
	});
});
