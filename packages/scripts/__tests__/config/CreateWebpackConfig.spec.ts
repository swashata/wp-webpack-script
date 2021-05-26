import webpackMerge from 'webpack-merge';
import { CreateWebpackConfig } from '../../src/config/CreateWebpackConfig';
import { ProjectConfig } from '../../src/config/project.config.default';
import { initConfig, projectConfig, serverConfig } from '../helpers/testConfig';

jest.mock('webpack-merge');
((webpackMerge as unknown) as jest.Mock).mockImplementation(() => ({
	foo: 'bar',
}));

beforeEach(initConfig);

declare const expect: jest.Expect;

describe('CreateWebpackConfig', () => {
	test('instantiates', () => {
		const cwc = new CreateWebpackConfig(
			projectConfig,
			serverConfig,
			'/foo/bar',
			true
		);
		expect(cwc).not.toBeFalsy();
	});

	describe('getWebpackConfig & isMultiCompiler', () => {
		test('works with single-compiler mode', () => {
			const multiProjectConfig: ProjectConfig = {
				...projectConfig,
				files: [
					{
						entry: {
							foo: './bar.js',
						},
						name: 'foo',
					},
				],
			};
			const cwc = new CreateWebpackConfig(
				multiProjectConfig,
				serverConfig,
				'/foo/bar',
				true
			);
			const config = cwc.getWebpackConfig();
			expect(config).not.toBeInstanceOf(Array);
			expect(cwc.isMultiCompiler()).toBeFalsy();
		});
		test('works with multi-compiler mode', () => {
			const multiProjectConfig: ProjectConfig = {
				...projectConfig,
				files: [
					{
						entry: {
							foo: './bar.js',
						},
						name: 'foo',
					},
					{
						entry: {
							bar: './foo.js',
						},
						name: 'bar',
					},
				],
			};
			const cwc = new CreateWebpackConfig(
				multiProjectConfig,
				serverConfig,
				'/foo/bar',
				true
			);
			const config = cwc.getWebpackConfig();
			expect(config).toBeInstanceOf(Array);
			expect(config).toHaveLength(2);
			expect(cwc.isMultiCompiler()).toBeTruthy();
		});
		test('works when files[n].webpackConfig is a function', () => {
			const mocker = jest.fn();
			// tslint:disable-next-line:no-any
			mocker.mockImplementation((c: Object, api: any) => ({
				...c,
				testSuccess: true,
			}));
			const multiProjectConfig: ProjectConfig = {
				...projectConfig,
				files: [
					{
						entry: {
							foo: './bar.js',
						},
						name: 'foo',
						webpackConfig: mocker,
					},
				],
			};
			const cwc = new CreateWebpackConfig(
				multiProjectConfig,
				serverConfig,
				'/foo/bar'
			);
			const config = cwc.getWebpackConfig();
			expect(mocker).toHaveBeenCalledTimes(1);
			expect(config).toHaveProperty('testSuccess');
			expect((config as { testSuccess: boolean }).testSuccess).toBeTruthy();
		});
		test('calls merge when files[n].webpackConfig is an object', () => {
			const multiProjectConfig: ProjectConfig = {
				...projectConfig,
				files: [
					{
						entry: {
							foo: './bar.js',
						},
						name: 'foo',
						webpackConfig: { cache: true },
					},
				],
			};
			const cwc = new CreateWebpackConfig(
				multiProjectConfig,
				serverConfig,
				'/foo/bar'
			);
			const config = cwc.getWebpackConfig();
			expect(webpackMerge).toHaveBeenCalledTimes(1);
			expect(config).toHaveProperty('foo');
		});
	});

	describe('path related apis', () => {
		test('publicPath sends proper stuff', () => {
			const cwc = new CreateWebpackConfig(
				projectConfig,
				serverConfig,
				'/foo/bar'
			);
			expect(cwc.getPublicPath()).toBe(
				`/wp-content/${projectConfig.type}s/${projectConfig.slug}/${projectConfig.outputPath}/`
			);
		});
		test('getHmrPath sends proper stuff', () => {
			const cwc = new CreateWebpackConfig(
				projectConfig,
				serverConfig,
				'/foo/bar'
			);
			expect(cwc.getHmrPath()).toBe(`/__wpackio_hmr`);
		});
		test('getPublicPathUrl sends proper stuff', () => {
			const cwc = new CreateWebpackConfig(
				projectConfig,
				serverConfig,
				'/foo/bar'
			);
			expect(cwc.getPublicPathUrl()).toBe(
				`//${serverConfig.host || 'localhost'}:${
					serverConfig.port
				}/wp-content/${projectConfig.type}s/${projectConfig.slug}/${
					projectConfig.outputPath
				}/`
			);
		});
		test('getServerUrl sends proper stuff', () => {
			const cwc = new CreateWebpackConfig(
				projectConfig,
				serverConfig,
				'/foo/bar'
			);
			expect(cwc.getServerUrl()).toBe(
				`//${serverConfig.host || 'localhost'}:${serverConfig.port}`
			);
		});
	});
});
