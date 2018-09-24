import preset from '../preset';

describe('@wpw/babel-preset-react', () => {
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
	test('has both @wpw/base and @babel/preset-react presets', () => {
		const babelConfig = preset();
		const presetWpwBase = babelConfig.presets.filter(
			ps => Array.isArray(ps) && ps[0] === '@wpw/base'
		);
		expect(presetWpwBase).toHaveLength(1);
		const presetReact = babelConfig.presets.filter(
			ps => Array.isArray(ps) && ps[0] === '@babel/preset-react'
		);
		expect(presetReact).toHaveLength(1);
	});

	describe('for @babel/preset-react', () => {
		test('passes presetReact to @babel/preset-react', () => {
			const presetReact = {
				pragma: 'foo',
				pragmaFrag: 'bar',
				development: false,
			};
			const babelConfig = preset({ presetReact });
			const presetReactConfig = babelConfig.presets.find(
				ps => Array.isArray(ps) && ps[0] === '@babel/preset-react'
			)[1];
			Object.keys(presetReact).forEach(pKey => {
				expect(presetReactConfig[pKey]).toEqual(presetReact[pKey]);
			});
		});
		test('sets default development value on preset-react', () => {
			const presetReact = {
				pragma: 'foo',
				pragmaFrag: 'bar',
			};
			// Get it when BABEL_ENV is 'production'
			process.env.BABEL_ENV = 'production';
			const presetReactConfigWithProduction = preset({
				presetReact,
			}).presets.find(
				ps => Array.isArray(ps) && ps[0] === '@babel/preset-react'
			)[1].development;
			expect(presetReactConfigWithProduction).toBe(false);
			// Get it when BABEL_ENV is in 'development'
			process.env.BABEL_ENV = 'development';
			const presetReactConfigWithDevelopment = preset({
				presetReact,
			}).presets.find(
				ps => Array.isArray(ps) && ps[0] === '@babel/preset-react'
			)[1].development;
			expect(presetReactConfigWithDevelopment).toBe(true);
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
				ps => Array.isArray(ps) && ps[0] === '@babel/preset-react'
			)[1].development;
			expect(presetReactConfigWithDevelopment).toBe(false);
		});
	});

	describe('for @wpw/base', () => {
		test('passes presetBase to @wpw/base', () => {
			const presetBase = {
				noJsonStrings: true,
				noImportMeta: false,
				presetEnv: {
					target: '> 1%, not dead',
				},
			};
			const babelConfig = preset({ presetBase });
			const presetBaseConfig = babelConfig.presets.find(
				ps => Array.isArray(ps) && ps[0] === '@wpw/base'
			)[1];
			Object.keys(presetBase).forEach(pKey => {
				expect(presetBaseConfig[pKey]).toEqual(presetBase[pKey]);
			});
		});
	});
});
