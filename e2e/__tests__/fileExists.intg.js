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
		const jsApps = ['app/runtime.js', 'app/main.js', 'app/main.css'];
		jsApps.forEach(file => {
			expect(
				fileExists(path.resolve(__dirname, '../dist/', file))
			).toBeTruthy();
		});
	});
	test('all typescript app got compiled', () => {
		const tsApps = ['tsapp/runtime.js', 'tsapp/main.js', 'tsapp/main.css'];
		tsApps.forEach(file => {
			expect(
				fileExists(path.resolve(__dirname, '../dist/', file))
			).toBeTruthy();
		});
	});
});
