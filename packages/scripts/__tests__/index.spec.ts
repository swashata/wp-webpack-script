import * as wpackioApi from '../src/index';

describe('wpackio scripts barrel', () => {
	test('exposes CreateWebpackConfig', () => {
		expect(wpackioApi).toHaveProperty('CreateWebpackConfig');
	});
	test('exposes WebpackConfigHelper', () => {
		expect(wpackioApi).toHaveProperty('WebpackConfigHelper');
	});
	test('exposes projectConfigDefault', () => {
		expect(wpackioApi).toHaveProperty('projectConfigDefault');
	});
	test('exposes serverConfigDefault', () => {
		expect(wpackioApi).toHaveProperty('serverConfigDefault');
	});
	test('exposes Build', () => {
		expect(wpackioApi).toHaveProperty('Build');
	});
	test('exposes Server', () => {
		expect(wpackioApi).toHaveProperty('Server');
	});
});
