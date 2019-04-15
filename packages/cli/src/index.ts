#!/usr/bin/env node

/**
 * CLI Tool for @wpackio/scripts
 *
 * This just uses npm or yarn to install @wpackio/scripts and runs
 * the tooling. It shouldn't do anything else.
 *
 * It should have minimum dependency and all @types should go inside
 * devDependency
 */

// tslint:disable:non-literal-fs-path

import chalk from 'chalk';
import program from 'commander';
import fs from 'fs';
import path from 'path';
import shelljs from 'shelljs';

const symErr = chalk.bgRed.black(' ERR ');
const symSucc = chalk.bgGreen.black(' SUC ');
const symWarn = chalk.bgYellow.black(' WAR ');
const symInfo = chalk.bgBlueBright.black(' INF ');
// Check for current version
const currentNodeVersion = process.versions.node;
const major = Number.parseInt(currentNodeVersion.split('.')[0], 10);

// Bail if node is lesser than 8
if (major < 8) {
	console.error(
		`${symErr} You are running Node ${major}. @wpackio/scripts requires Node 8 or higher.`
	);
	process.exit(1);
}

// Calculate basic things we need to bootstrap
const cwd = process.cwd();
const dirName = path.basename(cwd);

// Keep packageJson ready, in case we need to
const packageJson = {
	name: dirName,
	version: '0.1.0',
	private: true,
};

// Auto-detect yarn usage
let isYarn: boolean;

try {
	isYarn = fs.statSync(path.resolve(cwd, './yarn.lock')).isFile();
} catch (_) {
	isYarn = false;
}

// Check if package.json is present
let hasPackageJson: boolean;
try {
	hasPackageJson = fs.statSync(path.resolve(cwd, './package.json')).isFile();
} catch (_) {
	hasPackageJson = false;
}

// Init program
interface Package {
	version: string;
	name: string;
	private: boolean;
	scripts?: { [x: string]: string };
}
interface ProgramOption {
	client?: string;
}
// eslint-disable-next-line global-require
const pkg = require('../package.json') as Package;

program
	.version(pkg.version)
	.description('Bootstrap @wpackio/scripts into your project.')
	.option(
		'-c, --client [client]',
		`Which npm client to use. ${chalk.yellow('npm')} or ${chalk.yellow(
			'yarn'
		)}`
	)
	.action((options?: ProgramOption) => {
		// Select the client
		let client: 'yarn' | 'npm' = isYarn ? 'yarn' : 'npm';
		if (options && options.client) {
			if (options.client === 'yarn') {
				client = 'yarn';
			} else {
				client = 'npm';
			}
		}
		// create add depepdency command
		const depCommand =
			client === 'yarn'
				? 'yarn add --dev @wpackio/scripts'
				: 'npm i -D @wpackio/scripts';
		const bootCommand =
			client === 'yarn' ? 'yarn bootstrap' : 'npm run bootstrap';
		// Get path of packagejson
		const pkgJsonPath = path.resolve(cwd, './package.json');
		// Execute
		console.log(
			`${symInfo} bootstrapping @wpackio/scripts into your project`
		);
		console.log(`${symInfo} using client ${chalk.yellow(client)}`);
		if (hasPackageJson) {
			console.log(`${symInfo} ${chalk.yellow('package.json')} found`);
		} else {
			console.log(
				`${symInfo} ${chalk.red(
					'package.json'
				)} not found, creating one`
			);
			fs.writeFileSync(
				pkgJsonPath,
				JSON.stringify(packageJson, undefined, 2)
			);
			console.log(`${symSucc} created package.json file`);
		}
		console.log(`${symInfo} adding dependencies`);
		console.log(`${symInfo} ${chalk.dim(depCommand)}`);
		console.log(`${symInfo} this may take a while`);
		if (shelljs.exec(depCommand).code !== 0) {
			console.log(
				`${symWarn} there was some error installing the dependencies`
			);
			console.log(
				`${symWarn} please check and take corresponding actions`
			);
			console.log(
				`${symWarn} trying to continue since this can be non-fatal`
			);
		} else {
			console.log(`${symSucc} added dependencies`);
		}
		console.log(`${symInfo} adding scripts`);
		// eslint-disable-next-line global-require
		const pkgJson = require(pkgJsonPath) as Package;
		pkgJson.scripts = pkgJson.scripts || {};
		if (pkgJson.scripts) {
			pkgJson.scripts.bootstrap = 'wpackio-scripts bootstrap';
		} else {
			pkgJson.scripts = { bootstrap: 'wpackio-scripts bootstrap' };
		}
		fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, undefined, 2));
		console.log(`${symSucc} all operations done.`);
		console.log('\n\n');
		console.log(`Please run the following command to get started`);
		console.log('');
		console.log(`    ${chalk.yellow(bootCommand)}`);
		console.log('');
		console.log(`Happy programming!`);
	});

program.parse(process.argv);
