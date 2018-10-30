// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const path = require('path');
const fs = require('fs');

module.exports = (on, config) => {
	const jsFilePath = path.resolve(__dirname, '../../src/app/dynamic.js');
	const jsFileContent = fs.readFileSync(jsFilePath).toString();
	const tsFilePath = path.resolve(__dirname, '../../src/tsapp/module.ts');
	const tsFileContent = fs.readFileSync(tsFilePath).toString();
	// Change the file content
	on('task', {
		hmrJs: () => {
			fs.writeFileSync(jsFilePath, `${jsFileContent}\n// HMR`);
			return null;
		},
		hmrJsRestore: () => {
			fs.writeFileSync(jsFilePath, jsFileContent);
			return null;
		},
		hmrTs: () => {
			fs.writeFileSync(tsFilePath, `${tsFileContent}\n// HMR`);
			return null;
		},
		hmrTsRestore: () => {
			fs.writeFileSync(tsFilePath, tsFileContent);
			return null;
		},
	});
};
