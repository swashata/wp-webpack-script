import {
	ProjectConfig,
	projectConfigDefault,
} from '../../src/config/project.config.default';
import {
	ServerConfig,
	serverConfigDefault,
} from '../../src/config/server.config.default';
// Create separate configuration for easy use within every test
export let projectConfig: ProjectConfig;
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
