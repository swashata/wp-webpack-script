import path from 'path';
import {
	getProjectAndServerConfig,
	validateProjectConfig,
	validateServerConfig,
} from '../../src/config/getProjectAndServerConfig';
import { ProjectConfig } from '../../src/config/project.config.default';

const pathToDummyRight = path.resolve(
	__dirname,
	'../helpers/dummyConfigRight.js'
);
const pathToDummyWrong = path.resolve(
	__dirname,
	'../helpers/dummyConfigWrong.js'
);
const pathToDummyPCRight = path.resolve(
	__dirname,
	'../helpers/dummyPCRight.js'
);
const pathToDummyPCWrong = path.resolve(
	__dirname,
	'../helpers/dummyPCWrong.js'
);
const pathToDummySCRight = path.resolve(
	__dirname,
	'../helpers/dummySCRight.js'
);
const pathToDummySCWrong = path.resolve(
	__dirname,
	'../helpers/dummySCWrong.js'
);
const validCwd = path.resolve(__dirname, '../helpers');

describe('getProjectAndServerConfig', () => {
	describe('for projectConfig', () => {
		test('throws error if file not found', () => {
			expect(() => {
				getProjectAndServerConfig(__dirname);
			}).toThrowError('not find project configuration');
		});
		test('throws error if module.exports not an object', () => {
			expect(() => {
				getProjectAndServerConfig(__dirname, {
					projectConfig: pathToDummyWrong,
					serverConfig: pathToDummyRight,
				});
			}).toThrow('Project configuration must export an object literal.');
		});
		test('works properly if module.exports is an object', () => {
			expect(() => {
				getProjectAndServerConfig(__dirname, {
					projectConfig: pathToDummyPCRight,
					serverConfig: pathToDummySCRight,
				});
			}).not.toThrow();
		});
	});
	describe('for serverConfig', () => {
		test('throws error if file not found', () => {
			expect(() => {
				getProjectAndServerConfig(__dirname, {
					projectConfig: pathToDummyPCRight,
				});
			}).toThrowError('not find server configuration');
		});
		test('throws error if module.exports not an object', () => {
			expect(() => {
				getProjectAndServerConfig(__dirname, {
					projectConfig: pathToDummyPCRight,
					serverConfig: pathToDummyWrong,
				});
			}).toThrow('Server configuration must export an object literal.');
		});
		test('works properly if module.exports is an object', () => {
			expect(() => {
				getProjectAndServerConfig(__dirname, {
					projectConfig: pathToDummyPCRight,
					serverConfig: pathToDummySCRight,
				});
			}).not.toThrow();
		});
	});
	test('looks for default file under cwd', () => {
		const {
			projectConfigPath,
			serverConfigPath,
		} = getProjectAndServerConfig(validCwd);
		expect(projectConfigPath).toBe(
			path.resolve(validCwd, 'wpackio.project.js')
		);
		expect(serverConfigPath).toBe(
			path.resolve(validCwd, 'wpackio.server.js')
		);
	});
});

// tslint:disable:no-object-literal-type-assertion
describe('validateProjectConfig', () => {
	test('validates appName', () => {
		expect(() => {
			validateProjectConfig({
				appName: 'adasd-asdasd',
			} as ProjectConfig);
		}).toThrow('must be in camelCase');
		expect(() => {
			validateProjectConfig({} as ProjectConfig);
		}).toThrow('must be present');
	});
	test('validates files', () => {
		expect(() => {
			validateProjectConfig({
				appName: 'fooBar',
				files: {},
			} as ProjectConfig);
		}).toThrow('must be an array');
		expect(() => {
			validateProjectConfig(({
				appName: 'fooBar',
				files: [
					{
						foo: 'bar',
					},
				],
			} as unknown) as ProjectConfig);
		}).toThrow('must have objects with');
		expect(() => {
			validateProjectConfig(({
				appName: 'fooBar',
				files: ['foo'],
			} as unknown) as ProjectConfig);
		}).toThrow('must have objects with');
		expect(() => {
			validateProjectConfig(({
				appName: 'fooBar',
				files: [
					{
						name: 'foo',
					},
				],
			} as unknown) as ProjectConfig);
		}).toThrow('must have objects with');
	});
	test('validates packageDirPath', () => {
		expect(() => {
			validateProjectConfig(({
				appName: 'adasdAsdasd',
				files: [{ name: 'foo', entry: './src/js.js' }],
			} as unknown) as ProjectConfig);
		}).toThrow('It defines the path to package output directory');
		expect(() => {
			validateProjectConfig(({
				appName: 'adasdAsdasd',
				files: [{ name: 'foo', entry: './src/js.js' }],
				packageDirPath: '',
			} as unknown) as ProjectConfig);
		}).toThrow('It defines the path to package output directory');
	});
	test('validates packageFiles', () => {
		expect(() => {
			validateProjectConfig(({
				appName: 'adasdAsdasd',
				files: [{ name: 'foo', entry: './src/js.js' }],
				packageDirPath: 'package',
				packageFiles: [],
			} as unknown) as ProjectConfig);
		}).toThrow('must be valid glob patterns');
	});
});
