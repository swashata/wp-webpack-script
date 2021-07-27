import { babelPreset, babelPresetConfiguration, preset } from '../src/preset';

interface PresetOptions {
	[x: string]: string | boolean;
}

describe('preset in module', () => {
	const OLD_ENV = process.env;

	beforeEach(() => {
		jest.resetModules(); // this is important
		process.env = { ...OLD_ENV };
		delete process.env.NODE_ENV;
	});

	afterEach(() => {
		process.env = OLD_ENV;
	});

	test('is a function', () => {
		expect(typeof preset).toBe('function');
	});

	test('handles null or undefined options', () => {
		const configWithUndefined = preset();
		const configWithNull = preset(null);
		expect(typeof configWithUndefined).toBe('object');
		expect(typeof configWithNull).toBe('object');
	});

	test('has @babel/preset-react present by default', () => {
		const babelConfig = preset();
		const presetReact = babelConfig.presets.filter(
			ps =>
				Array.isArray(ps) && ps[0] === require.resolve('@babel/preset-react')
		);
		expect(presetReact).toHaveLength(1);
	});

	test('disables @babel/preset-react with hasReact=false', () => {
		const babelConfig = preset({ hasReact: false });
		const presetReact = babelConfig.presets.filter(
			ps =>
				Array.isArray(ps) && ps[0] === require.resolve('@babel/preset-react')
		);
		expect(presetReact).toHaveLength(0);
	});

	test('activates all plugins by default', () => {
		const { plugins } = preset();
		const activePlugins = [
			require.resolve('@babel/plugin-syntax-dynamic-import'),
			require.resolve('@babel/plugin-syntax-import-meta'),
			[require.resolve('@babel/plugin-proposal-class-properties')],
			require.resolve('@babel/plugin-proposal-json-strings'),
			[require.resolve('@babel/plugin-transform-runtime')],
			require.resolve('@babel/plugin-proposal-optional-chaining'),
		];
		activePlugins.forEach(plugin => {
			if (Array.isArray(plugin)) {
				const filteredActivePlugin = plugins.filter(
					p => Array.isArray(p) && p[0] === plugin[0]
				);
				expect(filteredActivePlugin).toHaveLength(1);
			} else {
				expect(plugins.indexOf(plugin)).not.toBe(-1);
			}
		});
	});

	test('disables plugins per option', () => {
		const { plugins } = preset({
			noDynamicImport: true,
			noImportMeta: true,
			noClassProperties: true,
			noJsonStrings: true,
			noRuntime: true,
			noOptionalChaining: true,
			noNullishCoalescingOperator: true,
		});
		expect(plugins).toHaveLength(1);
	});

	describe('for @babel/preset-env', () => {
		test('has @babel/preset-env present by default', () => {
			const babelConfig = preset();
			const presetEnv = babelConfig.presets.filter(
				ps =>
					Array.isArray(ps) && ps[0] === require.resolve('@babel/preset-env')
			);
			expect(presetEnv).toHaveLength(1);
		});

		test('passes all options from presetEnv to @babel/preset-env', () => {
			const envOptions: { presetEnv: babelPresetConfiguration } = {
				presetEnv: {
					targets: 'not-dead, > 25%',
					modules: 'umd',
					debug: true,
				},
			};
			const config = preset(envOptions);
			expect(config).toHaveProperty('presets');
			expect(config.presets).toBeInstanceOf(Array);
			// Now find the one with preset-env
			const presetEnv = config.presets.find(
				p => Array.isArray(p) && p[0] === require.resolve('@babel/preset-env')
			) as babelPreset;
			expect(presetEnv).toHaveLength(2);
			Object.keys(envOptions.presetEnv).forEach(key => {
				if (typeof presetEnv[1] === 'object') {
					const item = presetEnv[1][key];
					expect(item).toEqual(envOptions.presetEnv[key]);
				} else {
					// Throw an error
					throw new Error('preset is not passing options to env');
				}
			});
		});
	});

	describe('for @babel/preset-react', () => {
		test('passes presetReact to @babel/preset-react', () => {
			const presetReact: babelPresetConfiguration = {
				pragma: 'foo',
				pragmaFrag: 'bar',
				development: false,
			};
			const babelConfig = preset({ presetReact });
			const presetReactConfig = babelConfig.presets.find(
				ps =>
					Array.isArray(ps) && ps[0] === require.resolve('@babel/preset-react')
			) as babelPreset;
			Object.keys(presetReact).forEach(pKey => {
				if (typeof presetReactConfig[1] === 'object') {
					const item = presetReactConfig[1][pKey];
					expect(item).toEqual(presetReact[pKey]);
				} else {
					// Throw an error
					throw new Error('preset is not passing options to react');
				}
			});
		});
		test('sets default development value on preset-react', () => {
			const presetReact: babelPresetConfiguration = {
				pragma: 'foo',
				pragmaFrag: 'bar',
			};
			// Get it when BABEL_ENV is 'production'
			process.env.BABEL_ENV = 'production';
			const presetReactConfigWithProduction = preset({
				presetReact,
			}).presets.find(
				ps =>
					Array.isArray(ps) && ps[0] === require.resolve('@babel/preset-react')
			) as babelPreset;
			if (typeof presetReactConfigWithProduction[1] === 'object') {
				expect(presetReactConfigWithProduction[1].development).toBe(false);
			} else {
				throw new Error(
					'preset does not produce development config for react.'
				);
			}
			// Get it when BABEL_ENV is in 'development'
			process.env.BABEL_ENV = 'development';
			const presetReactConfigWithDevelopment = preset({
				presetReact,
			}).presets.find(
				ps =>
					Array.isArray(ps) && ps[0] === require.resolve('@babel/preset-react')
			) as babelPreset;
			if (typeof presetReactConfigWithDevelopment[1] === 'object') {
				expect(presetReactConfigWithDevelopment[1].development).toBe(true);
			} else {
				throw new Error(
					'preset does not produce development config for react.'
				);
			}
		});
		test('overrides development value on preset-react from user input', () => {
			const presetReact = {
				development: false,
			};
			// Let it think BABEL_ENV is in development
			process.env.BABEL_ENV = 'development';
			const presetReactConfigWithDevelopment = preset({
				presetReact,
			}).presets.find(
				ps =>
					Array.isArray(ps) && ps[0] === require.resolve('@babel/preset-react')
			) as babelPreset;
			if (typeof presetReactConfigWithDevelopment[1] === 'object') {
				expect(presetReactConfigWithDevelopment[1].development).toBe(false);
			} else {
				throw new Error(
					'preset does not produce development config for react.'
				);
			}
		});
	});
});
