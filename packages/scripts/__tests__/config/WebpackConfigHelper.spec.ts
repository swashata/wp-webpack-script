import miniCssExtractPlugin from 'mini-css-extract-plugin';
import {
	ProjectConfig,
	projectConfigDefault,
} from '../../src/config/project.config.default';
import {
	ServerConfig,
	serverConfigDefault,
} from '../../src/config/server.config.default';
import {
	WebpackConfigHelper,
	WebpackConfigHelperConfig,
} from '../../src/config/WebpackConfigHelper';

function getConfigFromProjectAndServer(
	pCfg: ProjectConfig,
	sCfg: ServerConfig
): WebpackConfigHelperConfig {
	return {
		type: pCfg.type,
		slug: pCfg.slug,
		host: sCfg.host,
		port: sCfg.port,
		outputPath: pCfg.outputPath,
		hasReact: pCfg.hasReact,
		hasSass: pCfg.hasSass,
		bannerConfig: pCfg.bannerConfig,
		alias: pCfg.alias,
		optimizeSplitChunks: pCfg.optimizeSplitChunks,
	};
}

// Create separate configuration for easy use within every test
let projectConfig: ProjectConfig;
let serverConfig: ServerConfig;
beforeEach(() => {
	projectConfig = {
		...projectConfigDefault,
		files: [
			{
				name: 'config1',
				entry: { foo: 'bar.js', biz: ['baz.js'] },
				filename: '[name].js',
			},
		],
	};
	serverConfig = { ...serverConfigDefault };
});

describe('CreateWebPackConfig', () => {
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
				const hotClient = entry[key].pop();
				expect(hotClient).toMatch(/^webpack\-hot\-middleware/);
				expect(hotClient).toMatch(/name\=config1/);
			});
		});
		test('does not have webpack hot client when isDev != true', () => {
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
			expect(output.path).toMatch(/\/config1$/);
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
			expect(devOutput.publicPath).toMatch(/^\/\/(.*)\/config1$/);
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
				/^\/\/(.*)\/wp-content\/plugins\/(.*)\/config1$/
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
	});

	// getModule()
	describe('getModule', () => {
		test('has babel-loader for both typescript and javascript', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				true
			);
			const modules = cwc.getModule();
			if (Array.isArray(modules.rules)) {
				const jsTsRules = modules.rules.filter(rule => {
					const { test } = rule;

					return (
						test !== undefined &&
						(test.toString() === '/\\.m?jsx?$/' ||
							test.toString() === '/\\.tsx?$/')
					);
				}) as { use: string[] }[];
				expect(jsTsRules).toHaveLength(2);
				jsTsRules.forEach(rule => {
					if (rule && rule.use) {
						expect(rule.use[0]).toBe('babel-loader');
					} else {
						throw new Error('JavaScript rule is undefined');
					}
				});
			} else {
				throw new Error('Module is not an array');
			}
		});

		test('uses style loader when in dev mode', () => {
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
				}) as { use: string[] };
				if (styleRule !== undefined) {
					expect(styleRule.use[0]).toBe('style-loader');
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

		test('matches snapshot', () => {
			const cwc = new WebpackConfigHelper(
				projectConfig.files[0],
				getConfigFromProjectAndServer(projectConfig, serverConfig),
				'/foo/bar',
				true
			);
			const modules = cwc.getModule();
			expect(modules).toMatchSnapshot();
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
					alias: alias,
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
		test('returns undefined when not in use', () => {
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
			expect(cwc.getOptimization()).toBeUndefined();
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
			expect(cwc.getOptimization()).toMatchSnapshot();
		});
	});

	// getCommmon
	describe('getCommon', () => {
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
			expect(cwcDev.getCommon().devtool).toBe('inline-source-map');
			expect(cwcDev.getCommon()).toMatchSnapshot();
		});
	});
});
