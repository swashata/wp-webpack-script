#!/usr/bin/env node
import program from 'commander';
import path from 'path';
import signale from 'signale';
import { ProjectConfig } from '../config/project.config.default';
import { ServerConfig } from '../config/server.config.default';
import { Build } from '../scripts/Build';
import { Server } from '../scripts/Server';

interface ProgramOptions {
	context?: string;
	projectConfig?: string;
	serverConfig?: string;
}

/* tslint:disable:no-require-imports no-var-requires */
const pkg = require('../../package.json') as { version: string };

const contextHelp: string = `Path to context or project root directory. Defaults to current working directory. It is recommended to use absolute path, else it is calculated from current working directory. The path you mention here should be what the URL 'localhost/wp-content/<themes|plugins>/<slug>/' map to. In most cases, you should leave it, because calling the program from npm or yarn script should automatically set it.`;
let isValidCommand = false;

// Declare version and stuff
program
	.version(pkg.version)
	.description('Start the development server or create production builds.')
	.usage('command [options]');

program.on('--help', () => {
	console.log('');
	console.log('Examples:');
	console.log('');
	console.log(
		'  %s start -p /path/to/wpackio.project.js',
		path.basename(process.argv[1])
	);
	console.log(
		'  %s build -c /path/to/project/root',
		path.basename(process.argv[1])
	);
});

// Commands

// Start the server
program
	.command('start')
	.description('Start the development server.')
	.option('-c, --context [path]', contextHelp)
	.option(
		'-p, --project-config [path]',
		'Path to project config. If it differs from ./wpackio.project.js'
	)
	.option(
		'-s, --server-config [path]',
		'Path to server config. If it differs from ./wpackio.server.js'
	)
	.action((options: ProgramOptions | undefined) => {
		isValidCommand = true;
		signale.start('Starting up wpack.io development server');
		// Set process.env.NODE_ENV to development
		process.env.NODE_ENV = 'development';
		// Set process.env.BABEL_ENV to development
		process.env.BABEL_ENV = 'development';
		// Get project and server config JSONs.
		const cwd = resolveCWD(options);
		signale.info(`Using startup path: ${cwd}`);
		try {
			const {
				projectConfig,
				serverConfig,
				projectConfigPath,
				serverConfigPath,
			} = getProjectAndServerConfig(cwd, options);
			signale.info(`Using project config from ${projectConfigPath}`);
			signale.info(`Using server config from ${serverConfigPath}`);
			// Start the webpack/browserSync server
			const server: Server = new Server(projectConfig, serverConfig, cwd);
			server.serve();
			// Listen for SIGINT and quit properly
			process.on('SIGINT', () => {
				signale.complete('Gracefully ending development server');
				server.stop();
				signale.success(
					'To create production build, run `yarn build` or `npm run build`'
				);
				signale.star('Thank you for using https://wpack.io.');
				signale.star('To spread the ❤️ please tweet.');
				process.exit(0);
			});
			process.on('SIGKILL', () => {
				server.stop();
			});
			process.on('SIGTERM', () => {
				server.stop();
			});
		} catch (e) {
			signale.error(
				'Could not start development server. Please check the log below.'
			);
			signale.fatal(e);
			process.exit(1);
		}
		// Listen for keyinput <r> and invalidate webpack builds.
	});

// Build the script
program
	.command('build')
	.description('Build production files.')
	.option('-c, --context', contextHelp)
	.option(
		'-p, --project-config [path]',
		'Path to project config. If it differs from ./wpackio.project.js'
	)
	.option(
		'-s, --server-config [path]',
		'Path to server config. If it differs from ./wpackio.server.js'
	)
	.action((options: ProgramOptions | undefined) => {
		isValidCommand = true;
		signale.start('Creating production builds...');
		// Set process.env.NODE_ENV to production
		process.env.NODE_ENV = 'production';
		// Set process.env.BABEL_ENV to production
		process.env.BABEL_ENV = 'production';
		// Get project and server config JSONs.
		const cwd = resolveCWD(options);
		signale.info(`Using startup path: ${cwd}`);
		try {
			const {
				projectConfig,
				serverConfig,
				projectConfigPath,
				serverConfigPath,
			} = getProjectAndServerConfig(cwd, options);
			signale.info(`Using project config from ${projectConfigPath}`);
			signale.info(`Using server config from ${serverConfigPath}`);
			// Start the webpack/browserSync server
			const build: Build = new Build(projectConfig, serverConfig, cwd);
			build
				.build()
				.then(log => {
					signale.success(
						'Build Successful. Please check the log below'
					);
					console.log(log);
					process.exit(0);
				})
				.catch(err => {
					signale.fatal(
						'Could not create production build. Please check the log below'
					);
					console.log(err);
					process.exit(1);
				});
		} catch (e) {
			signale.error(
				'Could not start development server. Please check the log below.'
			);
			signale.fatal(e);
			process.exit(1);
		}
	});

// Init
program.parse(process.argv);

// error on unknown commands
if (!isValidCommand) {
	signale.error(
		'Invalid command: %s\nSee usage below.\n\n',
		program.args.join(' ')
	);
	program.help();
}

/**
 * Resolve `cwd`, a.k.a, current working directory or context from user input.
 * It takes into account the `--context [path]` option from CLI and uses process
 * cwd, if not provided.
 *
 * @param options Options as received from CLI
 */
function resolveCWD(
	options: { context?: string | undefined } | undefined
): string {
	let cwd = process.cwd();
	// If user has provided cwd, then use that instead
	if (options && options.context) {
		const { context } = options;
		if (path.isAbsolute(options.context)) {
			cwd = context;
		} else {
			cwd = path.resolve(cwd, context);
		}
	}

	return cwd;
}

// tslint:disable: non-literal-require
function getProjectAndServerConfig(
	cwd: string,
	options: { projectConfig?: string; serverConfig?: string } | undefined
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

// Error out on force close
process.on('SIGKILL', () => {
	signale.fatal(
		'The operation failed because the process exited too early. ' +
			'This probably means the system ran out of memory or someone called ' +
			'`kill -9` on the process.'
	);
	process.exit(1);
});
process.on('SIGTERM', () => {
	signale.fatal(
		'The operation failed because the process exited too early. ' +
			'Someone might have called `kill` or `killall`, or the system could ' +
			'be shutting down.'
	);
	process.exit(1);
});
