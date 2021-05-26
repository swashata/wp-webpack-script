/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable jest/no-mocks-import */
import { mockedApi } from '../__mocks__/@babel/helper-plugin-utils';

const wpwBabelPresetBase = require('../src/index');

declare const expect: jest.Expect;

describe('@wpackio/babel-preset-base', () => {
	test('checks for babel 7', () => {
		wpwBabelPresetBase({}, undefined, __dirname);
		expect(mockedApi.assertVersion).toHaveBeenLastCalledWith(7);
	});
});
