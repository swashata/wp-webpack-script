// Plopfile for generating packages
// lerna create isn't the best tool for generating packages, so let's go with
// plop.js
// <https://github.com/amwmedia/plop>
// Get the defaults from package.json
const pkg = require('./package.json');

module.exports = plop => {
	// A shortcut for packagename
	plop.setPartial('pkgName', '{{kebabCase name}}');
	// Add new package
	plop.setGenerator('package', {
		description: 'Setup basic files for a new package.',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'name of the package under the scope @wpw',
			},
			{
				type: 'input',
				name: 'description',
				message: 'description of the package',
			},
			{
				type: 'input',
				name: 'author',
				message:
					'package author name/email for putting in package.json of the new package',
				default: pkg.author,
			},
		],
		actions: [
			// Add package.json
			{
				type: 'add',
				path: 'packages/{{pkgName}}/package.json',
				templateFile: 'plop-templates/package/package.json.hbs',
			},
			// Add src
			{
				type: 'add',
				path: 'packages/{{pkgName}}/src/index.js',
			},
			// Add .npmignore
			{
				type: 'add',
				path: 'packages/{{pkgName}}/.npmignore',
				templateFile: 'plop-templates/package/.npmignore.hbs',
			},
			// Add babel.config.js
			{
				type: 'add',
				path: 'packages/{{pkgName}}/babel.config.js',
				templateFile: 'plop-templates/package/babel.config.js.hbs',
			},
			// Add README.md
			{
				type: 'add',
				path: 'packages/{{pkgName}}/README.md',
				templateFile: 'plop-templates/package/README.md.hbs',
			},
		],
	});
};
