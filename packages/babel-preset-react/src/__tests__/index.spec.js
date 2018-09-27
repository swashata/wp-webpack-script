/* eslint-disable spaced-comment */
/// <reference types="jest" />
/* eslint-enable */

import wpwBabelPresetReact from '../index';
import mockedApi from '../../../../__mocks__/@babel/helper-plugin-utils';

describe('@wpackio/babel-preset-react', () => {
	test('checks for babel 7', () => {
		wpwBabelPresetReact({}, undefined, __dirname);
		expect(mockedApi.assertVersion).toHaveBeenLastCalledWith(7);
	});
});
