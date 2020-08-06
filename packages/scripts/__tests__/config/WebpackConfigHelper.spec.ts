import { PresetOptions } from '@wpackio/babel-preset-base/lib/preset';
// tslint:disable-next-line:no-implicit-dependencies
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import miniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import webpack from 'webpack';
import { webpackOptionsOverrideFunction } from '../../src/config/project.config.default';
import { WebpackConfigHelper } from '../../src/config/WebpackConfigHelper';
import { initConfig, projectConfig, serverConfig } from '../helpers/testConfig';
import {
	findWpackIoBabelOnJs,
	findWpackIoBabelOnTJs,
	findWpackIoBabelOnTs,
	getConfigFromProjectAndServer,
	findWpackIoBabelOnNm,
} from '../helpers/testUtils';

const currentDate: Date = new Date('2018-01-01T12:00:00');
const realDate = Date;

beforeAll(() => {
	// @ts-ignore
	global.Date = jest.fn(() => new realDate(currentDate.toISOString()));
	Object.assign(Date, realDate);
});

afterAll(() => {
	// restore global date
	global.Date = realDate;
});

beforeEach(initConfig);

describe('WebpackConfigHelper', () => {
	// Now do the testing

	test('can be instantiated with proper config', () => {
		const cwc = new WebpackConfigHelper(
			projectConfig.files[0],
			getConfigFromProjectAndServer(projectConfig, serverConfig),
			'/foo/bar',
			true
		);
		expect(cwc).toBeInstanceOf(WebpackConfigHelper);
	});

	// cwc.getEntry()
	describe('getEntry', () => {
		test('has webpack hot client with file `name` when isDev == true', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				true
			);
			const entry = cwc.getEntry();
			Object.keys(entry).forEach(key => {
				expect(Array.isArray(entry[key])).toBeTruthy();
				const hotClient = entry[key][0];
				expect(hotClient).toMatch(/^webpack\-hot\-middleware/);
				expect(hotClient).toMatch(/name\=config1/);
			});
		});
		test('does not have webpack hot client but publicPath wntrypoint when isDev != true', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				false
			);
			const entry = cwc.getEntry();
			Object.keys(entry).forEach(key => {
				expect(Array.isArray(entry[key])).toBeTruthy();
				expect(entry[key].pop()).not.toMatch(
					/^webpack\-hot\-middleware/
				);
				expect(entry[key][0]).toBe(`@wpackio/entrypoint/lib/index`);
			});
		});
	});

	// cwc.getOutput()
	describe('getOutput', () => {
		test('considers file `name` for outputpath', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				false
			);
			const output = cwc.getOutput();
			expect(output.path).toMatch(/\/dist$/);
			expect(output.filename).toBe('config1/[name]-[contenthash:8].js');
		});
		test('has empty publicPath on production build', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				false
			);
			const output = cwc.getOutput();
			expect(output.publicPath).toBe('');
		});
		test('has proper publicPath for developmenr server', () => {
			const devCwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				true
			);
			const devOutput = devCwc.getOutput();
			expect(devOutput.publicPath).toMatch(/^\/\/(.*)\/dist\/$/);
		});
		test('respects type for constructing publicPath on dev server', () => {
			const devCwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				true
			);
			const devOutput = devCwc.getOutput();
			expect(devOutput.publicPath).toMatch(
				/^\/\/(.*)\/wp-content\/plugins\/(.*)\/dist\/$/
			);
		});
	});

	// getPlugins()
	describe('getPlugins', () => {
		test('has proper plugins for build mode', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				false
			);
			const plugins = cwc.getPlugins();
			expect(plugins).toMatchSnapshot();
		});
		test('has proper plugins for dev mode', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				true
			);
			const plugins = cwc.getPlugins();
			expect(plugins).toMatchSnapshot();
		});
		test('has fork ts checker when tsconfig.json is present', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				path.resolve(__dirname, '../../'), // it's a hack cause the project has tsconfig.json
				true
			);
			const plugins = cwc.getPlugins();
			let hasTsChecker = false;
			plugins.forEach(plug => {
				if (plug instanceof ForkTsCheckerWebpackPlugin) {
					hasTsChecker = true;
				}
			});
			expect(hasTsChecker).toBeTruthy();
		});
	});

	// getModule()
	describe('getModule', () => {
		describe('babel-loader for typescript and javascript', () => {
			test('has babel-loader with caching', () => {
				const cwc = new WebpackConfigHelper(
					projectConfig.files[0],
					getConfigFromProjectAndServer(projectConfig, serverConfig),
					'/foo/bar',
					true
				);
				const modules = cwc.getModule();
				if (Array.isArray(modules.rules)) {
					const jsTsRules = findWpackIoBabelOnTJs(modules);
					expect(jsTsRules).toHaveLength(2);
					jsTsRules.forEach(rule => {
						if (rule && rule.use) {
							expect(rule.use[0].loader).toBe(require.resolve('babel-loader'));
							expect(rule.use[0].options).toMatchObject({
								cacheDirectory: true,
								cacheCompression: !true,
								compact: !true,
							});
						} else {
							throw new Error('JavaScript rule is undefined');
						}
					});
				} else {
					throw new Error('Module is not an array');
				}
			});

			test('has babel-loader for node_modules with caching', () => {
				const cwc = new WebpackConfigHelper(
					projectConfig.files[0],
					getConfigFromProjectAndServer(projectConfig, serverConfig),
					'/foo/bar',
					true
				);
				const modules = cwc.getModule();
				if (Array.isArray(modules.rules)) {
					const nmJsRules = findWpackIoBabelOnNm(modules);
					expect(nmJsRules).toHaveLength(1);
					nmJsRules.forEach(rule => {
						if (rule && rule.use) {
							expect(rule.use[0].loader).toBe(require.resolve('babel-loader'));
							expect(rule.use[0].options).toMatchObject({
								cacheDirectory: true,
								cacheCompression: !true,
								compact: !true,
								sourceMaps: false,
								configFile: false,
								babelrc: false,
							});
						} else {
							throw new Error('JavaScript rule is undefined');
						}
					});
				} else {
					throw new Error('Module is not an array');
				}
			});

			test('obeys hasFlow & hasRect', () => {
				const cwc = new WebpackConfigHelper(
					projectConfig.files[0],
					{
						...getConfigFromProjectAndServer(
							projectConfig,
							serverConfig
						),
						hasFlow: true,
						hasReact: true,
					},
					'/foo/bar',
					true
				);
				const modules = cwc.getModule();
				if (Array.isArray(modules.rules)) {
					const jsRule = findWpackIoBabelOnJs(modules);
					const tsRule = findWpackIoBabelOnTs(modules);
					expect(jsRule).toHaveLength(1);
					expect(tsRule).toHaveLength(1);
					[...jsRule, ...tsRule].forEach(rule => {
						if (rule && rule.use && rule.use[0].options) {
							expect(
								rule.use[0].options.presets[0][1]
							).toMatchObject({ hasReact: true });
						} else {
							throw new Error('babel rule is undefined');
						}
					});
					if (jsRule[0].use[0].options) {
						expect(jsRule[0].use[0].options.presets[1]).toEqual([
							require.resolve('@babel/preset-flow'),
						]);
					} else {
						throw new Error(
							'JavaScript babel-loader options not present'
						);
					}
				} else {
					throw new Error('Module is not an array');
				}
			});

			test('does not set babel-loader options except cache for js and ts files if useBabelConfig is true', () => {
				const cwc = new WebpackConfigHelper(
					projectConfig.files[0],
					{
						...getConfigFromProjectAndServer(
							projectConfig,
							serverConfig
						),
						useBabelConfig: true,
					},
					'/foo/bar',
					true
				);
				const modules = cwc.getModule();
				if (Array.isArray(modules.rules)) {
					const jsTsRules = findWpackIoBabelOnTJs(modules);
					expect(jsTsRules).toHaveLength(2);
					jsTsRules.forEach(rule => {
						if (rule && rule.use && rule.use[0].options) {
							expect(rule.use[0].options).toEqual({
								cacheDirectory: true,
								cacheCompression: !true,
								compact: !true,
							});
						} else {
							throw new Error('JavaScript rule is undefined');
						}
					});
				} else {
					throw new Error('Module is not an array');
				}
			});

			test('overrides @wpackio/babel-preset-base from config', () => {
				const override: PresetOptions = {
					noImportMeta: true,
					presetEnv: { modules: 'umd' },
					presetReact: { pragma: 'wp.createElement' },
				};
				const cwc = new WebpackConfigHelper(
					projectConfig.files[0],
					{
						...getConfigFromProjectAndServer(
							projectConfig,
							serverConfig
						),
						jsBabelPresetOptions: override,
						tsBabelPresetOptions: override,
					},
					'/foo/bar',
					true
				);

				const modules = cwc.getModule();
				if (Array.isArray(modules.rules)) {
					const jsTsRules = findWpackIoBabelOnTJs(modules);
					expect(jsTsRules).toHaveLength(2);
					jsTsRules.forEach(rule => {
						if (rule && rule.use && rule.use[0].options) {
							expect(
								rule.use[0].options.presets[0][1]
							).toMatchObject(override);
						} else {
							throw new Error('JavaScript rule is undefined');
						}
					});
				} else {
					throw new Error('Module is not an array');
				}
			});

			test('overrides all babel-loader options from config object', () => {
				const override: webpack.RuleSetLoader['options'] = {
					presets: 'foo',
					plugins: ['bar', 'baz'],
				};
				const cwc = new WebpackConfigHelper(
					projectConfig.files[0],
					{
						...getConfigFromProjectAndServer(
							projectConfig,
							serverConfig
						),
						jsBabelOverride: override,
						tsBabelOverride: override,
					},
					'/foo/bar',
					true
				);
				const modules = cwc.getModule();
				if (Array.isArray(modules.rules)) {
					const jsTsRules = findWpackIoBabelOnTJs(modules);
					expect(jsTsRules).toHaveLength(2);
					jsTsRules.forEach(rule => {
						if (rule && rule.use && rule.use[0].options) {
							expect(rule.use[0].options).toMatchObject(override);
						} else {
							throw new Error('JavaScript rule is undefined');
						}
					});
				} else {
					throw new Error('Module is not an array');
				}
			});

			test('overrides all babel-loader options from config function', () => {
				const override: webpackOptionsOverrideFunction = defaults => {
					if (typeof defaults === 'string') {
						return defaults;
					}
					return {
						...defaults,
						plugins: ['react-hot-loader/babel'],
					};
				};
				const cwc = new WebpackConfigHelper(
					projectConfig.files[0],
					{
						...getConfigFromProjectAndServer(
							projectConfig,
							serverConfig
						),
						jsBabelOverride: override,
						tsBabelOverride: override,
					},
					'/foo/bar',
					true
				);
				const modules = cwc.getModule();
				if (Array.isArray(modules.rules)) {
					const jsTsRules = findWpackIoBabelOnTJs(modules);
					expect(jsTsRules).toHaveLength(2);
					jsTsRules.forEach(rule => {
						if (rule && rule.use && rule.use[0].options) {
							expect(rule.use[0].options).toMatchObject({
								plugins: ['react-hot-loader/babel'],
							});
						} else {
							throw new Error('JavaScript rule is undefined');
						}
					});
				} else {
					throw new Error('Module is not an array');
				}
			});
		});

		test('uses miniCssExtractPlugin when in dev mode', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				true
			);
			const modules = cwc.getModule();
			if (Array.isArray(modules.rules)) {
				const styleRule = modules.rules.find(rule => {
					const { test } = rule;

					return (
						test !== undefined &&
						(test.toString() === '/\\.css$/' ||
							test.toString() === '/\\.(sa|sc|c)ss$/')
					);
				}) as { use: { loader: string }[] };
				if (styleRule !== undefined) {
					expect(styleRule.use[0].loader).toBe(miniCssExtractPlugin.loader);
				} else {
					throw new Error('No style rule found');
				}
			} else {
				throw new Error('Module.rules is not an array');
			}
		});

		test('uses miniCssExtractPlugin when in production mode', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				false
			);
			const modules = cwc.getModule();
			if (Array.isArray(modules.rules)) {
				const styleRule = modules.rules.find(rule => {
					const { test } = rule;

					return (
						test !== undefined &&
						(test.toString() === '/\\.css$/' ||
							test.toString() === '/\\.(sa|sc|c)ss$/')
					);
				}) as { use: { loader: string }[] };
				if (styleRule !== undefined) {
					expect(styleRule.use[0].loader).toBe(
						miniCssExtractPlugin.loader
					);
				} else {
					throw new Error('No style rule found');
				}
			} else {
				throw new Error('Module.rules is not an array');
			}
		});

		test('has css specific file-loader option in prod mode', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				false
			);
			const modules = cwc.getModule();
			if (Array.isArray(modules.rules)) {
				const fileRule = modules.rules.find(rule => {
					const use = rule.use as { [_: string]: any }[];
					return (
						use !== undefined &&
						use[0].loader === require.resolve('file-loader') &&
						use[0].options.publicPath === 'assets/'
					);
				});
				expect(fileRule).not.toBeUndefined();
			} else {
				throw new Error('Module.rules is not an array');
			}
		});

	});

	// getResolve()
	describe('getResolve', () => {
		test('has all entry extensions and aliases', () => {
			const alias: { [x: string]: string } = {
				App: 'src/app',
				Util: 'src/util',
			};
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				{
					...getConfigFromProjectAndServer(
						projectConfig,
						serverConfig
					),
					alias,
				},
				'/foo/bar',
				false
			);
			const resolve = cwc.getResolve();
			expect(resolve.extensions).toContain('.js');
			expect(resolve.extensions).toContain('.jsx');
			expect(resolve.extensions).toContain('.ts');
			expect(resolve.extensions).toContain('.tsx');
			expect(resolve.alias).toEqual(alias);
		});
	});

	// getOptimization()
	describe('getOptimization', () => {
		test('returns just runtimeChunk when not in use', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				{
					...getConfigFromProjectAndServer(
						projectConfig,
						serverConfig
					),
					optimizeSplitChunks: false,
				},
				'/foo/bar',
				false
			);
			expect(cwc.getOptimization()).toEqual({ runtimeChunk: 'single' });
		});

		test('returns object when in use', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				{
					...getConfigFromProjectAndServer(
						projectConfig,
						serverConfig
					),
					optimizeSplitChunks: true,
				},
				'/foo/bar',
				false
			);
			expect(cwc.getOptimization()).not.toBeUndefined();
			expect(
				(cwc.getOptimization() as webpack.Options.Optimization)
					.runtimeChunk
			).toBe('single');
		});
	});

	// getCommmon
	describe('getCommon', () => {
		test('has externals', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				{
					...getConfigFromProjectAndServer(
						projectConfig,
						serverConfig
					),
				},
				'/foo/bar',
				true
			);
			expect(cwc.getCommon().externals).toBe(projectConfig.externals);
		});
		test('sends proper stuff depending on isDev', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				{
					...getConfigFromProjectAndServer(
						projectConfig,
						serverConfig
					),
				},
				'/foo/bar',
				false
			);
			expect(cwc.getCommon().devtool).toBe('source-map');
			expect(cwc.getCommon()).toMatchSnapshot();
			const cwcDev = new WebpackConfigHelper(
				projectConfig.files[0],
				{
					...getConfigFromProjectAndServer(
						projectConfig,
						serverConfig
					),
				},
				'/foo/bar',
				true
			);
			expect(cwcDev.getCommon().devtool).toBe(
				'cheap-module-source-map'
			);
			expect(cwcDev.getCommon()).toMatchSnapshot();
		});
	});
});
