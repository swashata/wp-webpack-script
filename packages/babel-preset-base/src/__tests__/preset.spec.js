import preset from '../preset';

describe('@wpw/babel-preset-base/preset', () => {
	test('is a function', () => {
		expect(typeof preset).toBe('function');
	});

	test('handles null or undefined options', () => {
		const configWithUndefined = preset();
		const configWithNull = preset(null);
		expect(typeof configWithUndefined).toBe('object');
		expect(typeof configWithNull).toBe('object');
	});

	test('passes all options to @babel/preset-env', () => {
		const envOptions = {
			targets: 'not-dead, > 25%',
			modules: 'umd',
			debug: true,
		};
		const config = preset(envOptions);
		expect(config).toHaveProperty('presets');
		expect(config.presets).toBeInstanceOf(Array);
		// Now find the one with preset-env
		const presetEnv = config.presets.find(
			p => Array.isArray(p) && p[0] === '@babel/preset-env'
		);
		expect(presetEnv).toHaveLength(2);
		Object.keys(envOptions).forEach(key => {
			expect(presetEnv[1][key]).toBe(envOptions[key]);
		});
	});

	test('activates all plugins by default', () => {
		const { plugins } = preset();
		const activePlugins = [
			'@babel/plugin-syntax-dynamic-import',
			'@babel/plugin-syntax-import-meta',
			['@babel/plugin-proposal-class-properties'],
			'@babel/plugin-proposal-json-strings',
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
		});
		expect(plugins).toHaveLength(0);
	});
});
