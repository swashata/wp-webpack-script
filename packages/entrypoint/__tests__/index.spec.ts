// this import is to make this file a module so that we can override expect
import { IGNORE } from '../src/module';

declare const expect: jest.Expect;

describe('entrypoint', () => {
	test('sets __webpack_public_path__ from WPACKIO(webpack.DefinePlugin)', () => {
		const oldGlobal = global;
		// tslint:disable-next-line:no-any
		// eslint-disable-next-line no-underscore-dangle
		expect((global as { [x: string]: any }).__webpack_public_path__).toBe('');
		// Require our package
		// eslint-disable-next-line global-require
		require('../src/index');
		// tslint:disable-next-line:no-any
		// eslint-disable-next-line no-underscore-dangle
		expect((global as { [x: string]: any }).__webpack_public_path__).toBe(
			'/biz/baz'
		);
		// tslint:disable-next-line:no-any
		// eslint-disable-next-line no-global-assign
		(global as any) = oldGlobal;
	});
});
