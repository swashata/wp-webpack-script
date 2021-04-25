import camelCase from 'camelcase';
import chalk from 'chalk';
import path from 'path';
import { isYarn } from '../bin/utils';
import { WpackioError } from '../errors/WpackioError';
import { ProjectConfig, projectConfigDefault } from './project.config.default';
import { ServerConfig, serverConfigDefault } from './server.config.default';

export function validateProjectConfig(projectConfig: ProjectConfig): boolean {
	if (typeof projectConfig !== 'object') {
		throw new WpackioError(
			`Project configuration must export an object literal.\nRight now it is ${chalk.yellow(
				typeof projectConfig
			)}`
		);
	}

	// Check if the appName is okay
	if (!projectConfig.appName) {
		throw new WpackioError(
			`${chalk.yellow('appName')} must be present in project config.`
		);
	}
	if (!/^[A-Za-z]+$/.test(projectConfig.appName)) {
		throw new WpackioError(
			`${chalk.yellow(
				'appName'
			)} must be in camelCase in project config.\nCurrently ${chalk.red(
				projectConfig.appName
			)}, try ${chalk.green(camelCase(projectConfig.appName))}`
		);
	}
	// validate runtime config
	// 1. if files is invalid
	if (!projectConfig.files || !Array.isArray(projectConfig.files)) {
		throw new WpackioError(
			`${chalk.yellow(
				'files'
			)} under project configuration must be an array.\nCurrently it is ${chalk.red(
				typeof projectConfig.files
			)}`
		);
	}
	// 2. if files is empty
	if (projectConfig.files.length === 0) {
		throw new WpackioError(
			`${chalk.yellow(
				'files'
			)} under project configuration must have at-least one object.`
		);
	}
	// 3. validate files array
	if (
		!projectConfig.files.every(
			file =>
				typeof file === 'object' && file.name != null && file.entry != null
		)
	) {
		throw new WpackioError(
			`${chalk.yellow(
				'files'
			)} under project configuration must have objects with\n${chalk.magenta(
				'name'
			)} and ${chalk.magenta(
				'entry'
			)}.\nAt-least one of the objects does not satisfy the condition.`
		);
	}
	// 4. Validate package configs
	if (!projectConfig.packageDirPath || projectConfig.packageDirPath === '') {
		throw new WpackioError(
			`${chalk.yellow(
				'packageDirPath'
			)} under project configuration must be valid.\nIt defines the path to package output directory.`
		);
	}
	if (
		!projectConfig.packageFiles ||
		!Array.isArray(projectConfig.packageFiles) ||
		!projectConfig.packageFiles.length ||
		!projectConfig.packageFiles.every(f => typeof f === 'string')
	) {
		throw new WpackioError(
			`${chalk.yellow(
				'packageFiles'
			)} under project configuration must be valid glob patterns.`
		);
	}
	return true;
}

export function validateServerConfig(serverConfig: ServerConfig): boolean {
	if (typeof serverConfig !== 'object') {
		throw new WpackioError(
			`Server configuration must export an object literal.\nRight now it is ${chalk.yellow(
				typeof serverConfig
			)}`
		);
	}
	// Check if server config has proxy
	if (!serverConfig.proxy || serverConfig.proxy === '') {
		throw new WpackioError(
			`${chalk.yellow(
				'proxy'
			)} under server configuration must be an URL to your development server.`
		);
	}
	return true;
}

export function getProjectConfig(
	cwd: string,
	options?:
		| {
				projectConfig?: string;
		  }
		| undefined
): {
	projectConfig: ProjectConfig;
	projectConfigPath: string;
} {
	const projectConfigPath = path.resolve(
		cwd,
		options && options.projectConfig
			? options.projectConfig
			: 'wpackio.project.js'
	);

	let projectConfig: ProjectConfig;

	// First check to see if the files are present
	try {
		// eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
		projectConfig = require(projectConfigPath) as ProjectConfig;
	} catch (e) {
		throw new WpackioError(
			`Could not find project configuration at:\n${chalk.dim(
				projectConfigPath
			)}\nPlease make sure the file exists\nor adjust your ${chalk.yellow(
				'--context'
			)} or ${chalk.yellow(
				'--project-config'
			)} parameters.\nIf this is your first time, try running\n${chalk.magenta(
				`${isYarn() ? 'yarn' : 'npm run'} bootstrap`
			)}`
		);
	}

	// Now validate them
	validateProjectConfig(projectConfig);

	return {
		projectConfig: { ...projectConfigDefault, ...projectConfig },
		projectConfigPath,
	};
}

export function getServerConfig(
	cwd: string,
	options?:
		| {
				serverConfig?: string;
		  }
		| undefined
): {
	serverConfig: ServerConfig;
	serverConfigPath: string;
} {
	// Get the config file paths from options
	// If user is passing relative path, then it will be used along with cwd
	// If it is absolute path, then the absolute would be used instead
	// This is how path.resolve works.
	const serverConfigPath = path.resolve(
		cwd,
		options && options.serverConfig ? options.serverConfig : 'wpackio.server.js'
	);
	// Now create the configuration objects
	let serverConfig: ServerConfig;

	try {
		// eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
		serverConfig = require(serverConfigPath) as ServerConfig;
	} catch (e) {
		throw new WpackioError(
			`Could not find server configuration at:\n${chalk.dim(
				serverConfigPath
			)}\nPlease make sure the file exists\nor adjust your ${chalk.yellow(
				'--context'
			)} or ${chalk.yellow(
				'--server-config'
			)} parameters.\nIf this is your first time, try running\n${chalk.magenta(
				`${isYarn() ? 'yarn' : 'npm run'} bootstrap`
			)}`
		);
	}

	// Validate them
	validateServerConfig(serverConfig);

	return {
		serverConfig: { ...serverConfigDefault, ...serverConfig },
		serverConfigPath,
	};
}

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
	return {
		...getProjectConfig(cwd, options),
		...getServerConfig(cwd, options),
	};
}
