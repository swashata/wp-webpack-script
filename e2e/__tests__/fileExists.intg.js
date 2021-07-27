/* eslint-disable import/extensions */
/* eslint-disable spaced-comment, jest/valid-expect */
/// <reference types="jest" />

const fs = require('fs');
const path = require('path');
const jsManifest = require('../dist/app/manifest.json');
const tsManifest = require('../dist/tsapp/manifest.json');

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
			...jsManifest.wpackioEp.main.assets.js,
			...jsManifest.wpackioEp.main.assets.css,
		];
		jsApps.forEach(file => {
			expect(
				fileExists(path.resolve(__dirname, '../dist/', file))
			).toBeTruthy();
		});
	});
	test('all typescript app got compiled', () => {
		const tsApps = [
			...tsManifest.wpackioEp.main.assets.js,
			...tsManifest.wpackioEp.main.assets.css,
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
			...jsManifest.wpackioEp.main.assets.js.map(item => `dist/${item}`),
			...tsManifest.wpackioEp.main.assets.js.map(item => `dist/${item}`),
			'dist/app/manifest.json',
			'dist/tsapp/manifest.json',
		];
		zipFiles.forEach(file => {
			expect(
				fileExists(path.resolve(__dirname, '../package/e2e-plug/', file))
			).toBeTruthy();
		});
	});
	test('zip file got created', () => {
		expect(
			fileExists(path.resolve(__dirname, '../package/e2e-plug.zip'))
		).toBeTruthy();
	});
});
