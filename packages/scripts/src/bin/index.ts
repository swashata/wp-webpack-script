#!/usr/bin/env node
import chalk from 'chalk';
import program from 'commander';
import path from 'path';
import clearConsole from 'react-dev-utils/clearConsole';
import updateNotifier from 'update-notifier';
import { bootstrap } from './bootstrap';
import { build } from './build';
import { serve } from './serve';
import { bulletSymbol, contextHelp, printIntro } from './utils';

export interface ProgramOptions {
	context?: string;
	projectConfig?: string;
	serverConfig?: string;
}

let isValidCommand = false;

/* tslint:disable:no-require-imports no-var-requires non-literal-require */
const pkg = require('../../package.json') as updateNotifier.Package;

// Notify for updates
updateNotifier({ pkg }).notify();

// Declare version and stuff
program
	.version(pkg.version)
	.description('Start the development server or create production builds.')
	.usage('command [options]');

program.on('--help', () => {
	console.log('');
	console.log(chalk.cyan.bold('Examples:'));
	console.log('');
	console.log(
		'  %s start -p /path/to/wpackio.project.js',
		path.basename(process.argv[1])
	);
	console.log(
		'  %s build -c /path/to/project/root',
		path.basename(process.argv[1])
	);
	console.log('');
	console.log(chalk.cyan.bold('Bootstrap/Onboarding:'));
	console.log(`If you are just starting out with wpackio-scripts, then run

    ${bulletSymbol} ${chalk.yellow('npx @wpackio/scripts bootstrap')}

If you already have the project config file and would like to configure
local server for this machine, then run

    ${bulletSymbol} ${chalk.yellow('npm run bootstrap')}
            OR
    ${bulletSymbol} ${chalk.yellow('yarn bootstrap')}

Remember to always keep local server config out of VCS,
because it would differ for team members.
	`);
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
		serve(options);
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
		build(options);
	});

// Init the project
program
	.command('init')
	.description('create project and/or server configuration files.')
	.option('-c, --context', contextHelp)
	.action((options: ProgramOptions | undefined) => {
		isValidCommand = true;
		bootstrap(options, pkg.version);
	});

// Output our fancy stuff first
clearConsole();
printIntro();

// Init
program.parse(process.argv);

// error on unknown commands
if (!isValidCommand) {
	console.error(
		'Invalid command: %s\nSee usage below.\n\n',
		program.args.join(' ')
	);
	program.help();
}
