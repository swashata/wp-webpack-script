import os from 'os';
import { codeFrameColumns as codeFrame } from '@babel/code-frame';
import chalk from 'chalk';
import fs from 'fs';

const issueOrigins = {
	typescript: 'TypeScript',
	internal: 'fork-ts-checker-webpack-plugin',
};

export type issueType = {
	origin: 'typescript' | 'internal';
	code: string;
	severity: 'error' | 'warning';
	message: string;
	file: string;
	location: {
		start: {
			line: number;
			column: number;
		};
		end: {
			line: number;
			column: number;
		};
	};
};

export function typescriptFormatter(issue: issueType, cwd: string) {
	const { origin, severity, file, location, message, code } = issue;

	const colors = chalk;
	const messageColor = severity === 'warning' ? colors.yellow : colors.red;
	const fileAndNumberColor = colors.bold.cyan;

	const source =
		file && fs.existsSync(file) && fs.readFileSync(file, 'utf-8');
	const frame = source
		? codeFrame(source, location, {
				highlightCode: true,
				forceColor: true,
				linesAbove: 3,
				linesBelow: 1,
		  })
				.split('\n')
				.map(str => `  ${str}`)
				.join(os.EOL)
		: '';

	return [
		messageColor.bold(
			`${issueOrigins[origin]} ${severity.toLowerCase()} in `
		) +
			fileAndNumberColor(
				`${file.replace(cwd, '.')}(${location.start.line},${
					location.start.column
				})`
			) +
			messageColor(':'),
		`${message}  ${messageColor.underline(`TS${code}`)}`,
		'',
		frame,
	].join(os.EOL);
}
