import path from 'path';
import { ProjectConfig } from './project.config.default';
import { ServerConfig } from './server.config.default';
// tslint:disable: non-literal-require
export function getProjectAndServerConfig(
	cwd: string,
	options?:
		| {
				projectConfig?: string;
				serverConfig?: string;
		  }
		| undefined
): {
	projectConfig: ProjectConfig;
	serverConfig: ServerConfig;
	projectConfigPath: string;
	serverConfigPath: string;
} {
	// Get the config file paths from options
	// If user is passing relative path, then it will be used along with cwd
	// If it is absolute path, then the absolute would be used instead
	// This is how path.resolve works.
	const projectConfigPath = path.resolve(
		cwd,
		options && options.projectConfig
			? options.projectConfig
			: 'wpackio.project.js'
	);
	const serverConfigPath = path.resolve(
		cwd,
		options && options.serverConfig
			? options.serverConfig
			: 'wpackio.server.js'
	);
	// Now create the configuration objects
	let projectConfig: ProjectConfig;
	let serverConfig: ServerConfig;
	// First check to see if the files are present
	try {
		projectConfig = require(projectConfigPath) as ProjectConfig;
	} catch (e) {
		throw new Error(
			`Could not find project configuration at:\n${projectConfigPath}\nPlease make sure the file exists or adjust your --context or --project-config parameters.`
		);
	}
	try {
		serverConfig = require(serverConfigPath) as ServerConfig;
	} catch (e) {
		throw new Error(
			`Could not find server configuration at:\n${serverConfigPath}\nPlease make sure the file exists or adjust your --context or --server-config parameters.`
		);
	}
	// Now validate them
	if (typeof projectConfig !== 'object') {
		throw new Error(
			`Project configuration must export an object literal. Right now it is ${typeof projectConfig}`
		);
	}
	if (typeof serverConfig !== 'object') {
		throw new Error(
			`Server configuration must export an object literal. Right now it is ${typeof serverConfig}`
		);
	}
	// @todo
	// Also validate the config, but let's leave it for now
	// Make sure to do it in future
	return { projectConfig, serverConfig, projectConfigPath, serverConfigPath };
}
