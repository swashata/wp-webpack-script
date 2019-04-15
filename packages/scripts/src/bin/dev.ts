#!/usr/bin/env node
/**
 * This file provides a cli helpline for developers to quickly check
 * the output of different commands without touching the file-system.
 *
 * Check the source code for more documentation
 */

import program from 'commander';
import process from 'process';
import { Bootstrap } from '../scripts/Bootstrap';
import { printIntro } from './utils';

program
	.command('bootstrap')
	.description('Check the CLI output of bootstrap command')
	.action(async () => {
		const bs = new Bootstrap(process.cwd(), '0.0.0-dev');
		const answer = await bs.getUserInput();
		console.log(JSON.stringify(answer, null, 4));
	});

program
	.command('intro')
	.description('Check CLI intro')
	.action(() => {
		printIntro();
	});

program.parse(process.argv);
