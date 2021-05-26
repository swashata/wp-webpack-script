import {
	ProjectConfig,
	projectConfigDefault,
} from '../../src/config/project.config.default';
import {
	ServerConfig,
	serverConfigDefault,
} from '../../src/config/server.config.default';
// Create separate configuration for easy use within every test
// eslint-disable-next-line import/no-mutable-exports
export let projectConfig: ProjectConfig;
// eslint-disable-next-line import/no-mutable-exports
export let serverConfig: ServerConfig;
export const initConfig = (): void => {
	projectConfig = {
		...projectConfigDefault,
		files: [
			{
				name: 'config1',
				entry: { foo: 'bar.js', biz: ['baz.js'] },
			},
		],
	};
	serverConfig = { ...serverConfigDefault };
};
