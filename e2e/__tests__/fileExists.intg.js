/* eslint-disable spaced-comment, jest/valid-expect */
/// <reference types="jest" />

const fs = require('fs');
const path = require('path');

function fileExists(filepath) {
	try {
		return fs.statSync(filepath).isFile();
	} catch (_) {
		return false;
	}
}

describe('after build', () => {
	test('all javascript app got compiled', () => {
		const jsApps = [
			'app/runtime.js',
			'app/main.js',
			'app/main.css',
			'app/manifest.json',
		];
		jsApps.forEach(file => {
			expect(
				fileExists(path.resolve(__dirname, '../dist/', file))
			).toBeTruthy();
		});
	});
	test('all typescript app got compiled', () => {
		const tsApps = [
			'tsapp/runtime.js',
			'tsapp/main.js',
			'tsapp/main.css',
			'tsapp/manifest.json',
		];
		tsApps.forEach(file => {
			expect(
				fileExists(path.resolve(__dirname, '../dist/', file))
			).toBeTruthy();
		});
	});
});

describe('after pack', () => {
	test('all files got copied', () => {
		const zipFiles = [
			'index.html',
			'README.md',
			'dist/app/runtime.js',
			'dist/app/main.js',
			'dist/app/main.css',
			'dist/app/manifest.json',
			'dist/tsapp/runtime.js',
			'dist/tsapp/main.js',
			'dist/tsapp/main.css',
			'dist/tsapp/manifest.json',
		];
		zipFiles.forEach(file => {
			expect(
				fileExists(
					path.resolve(__dirname, '../package/e2e-plug/', file)
				)
			).toBeTruthy();
		});
	});
	test('zip file got created', () => {
		expect(
			fileExists(path.resolve(__dirname, '../package/e2e-plug.zip'))
		).toBeTruthy();
	});
});
