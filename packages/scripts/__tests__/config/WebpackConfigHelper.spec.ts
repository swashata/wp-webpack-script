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
	projectConfig: ProjectConfig,
	serverConfig: ServerConfig
): WebpackConfigHelperConfig {
	return {
		type: projectConfig.type,
		slug: projectConfig.slug,
		host: serverConfig.host,
		port: serverConfig.port,
		outputPath: projectConfig.outputPath,
		hasReact: projectConfig.hasReact,
		hasSass: projectConfig.hasSass,
		bannerConfig: projectConfig.bannerConfig,
		alias: projectConfig.alias,
		optimizeSplitChunks: projectConfig.optimizeSplitChunks,
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
				entry: { foo: 'bar.js', biz: 'baz.js' },
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
});
