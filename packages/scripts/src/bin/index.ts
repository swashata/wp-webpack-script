#!/usr/bin/env node
import program from 'commander';
import path from 'path';

/* tslint:disable:no-require-imports no-var-requires */
const pkg = require('../../package.json');

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
	.action(options => {
		isValidCommand = true;
		console.log('should start script.', options.context);
		// Set process.env.NODE_ENV to development
		// Set process.env.BABEL_ENV to development
		// Get project and server config JSONs.
		// Start the webpack/browserSync server
		// Listen for SIGTERM and quit properly
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
	.action(options => {
		isValidCommand = true;
		console.log('should build the script', options.context);
		// Set process.env.NODE_ENV to production
		// Set process.env.BABEL_ENV to production
		// Get project and server config JSONs.
		// Compile scripts using webpack
	});

// Init
program.parse(process.argv);

// error on unknown commands
if (!isValidCommand) {
	console.error(
		'Invalid command: %s\nSee --help for a list of available commands.',
		program.args.join(' ')
	);
	process.exit(1);
}
