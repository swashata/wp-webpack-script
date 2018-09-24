/* eslint-disable spaced-comment */
/// <reference types="jest" />
/* eslint-enable */

import wpwBabelPresetBase from '../index';
import mockedApi from '../../../../__mocks__/@babel/helper-plugin-utils';

describe('@wpw/babel-preset-base', () => {
	test('checks for babel 7', () => {
		wpwBabelPresetBase({}, undefined, __dirname);
		expect(mockedApi.assertVersion).toHaveBeenCalledWith(7);
	});
});
