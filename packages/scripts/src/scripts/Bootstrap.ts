import camelCase from 'camelcase';
import fs from 'fs';
import handlebars from 'handlebars';
import inquirer from 'inquirer';
import path from 'path';
import slugify from 'slugify';

interface Pkg {
	name: string;
	homepage?: string;
	author?: string | { name: string; email: string; url: string };
	license?: string;
	scripts?: {
		[x: string]: string;
	};
	dependencies?: {
		[x: string]: string;
	};
	devDependencies?: {
		[x: string]: string;
	};
}

interface ProjectConfigContext {
	appName: string;
	type: string;
	slug: string;
	author: string;
	license: string;
	outputPath: string;
	hasReact: 'true' | 'false';
	hasFlow: 'true' | 'false';
	hasTS: 'true' | 'false';
	hasSass: 'true' | 'false';
	hasLess: 'true' | 'false';
	watch: string;
}

interface ServerConfigContext {
	proxy: string;
}

export interface ProjectDependencies {
	dependencies: string[];
	devDependencies: string[];
}

class InitResolve {
	public configured: 'project' | 'server';

	public projectConfigContext?: ProjectConfigContext;

	public serverConfigContext?: ServerConfigContext;

	public deps?: ProjectDependencies;

	constructor(
		configured: 'project' | 'server',
		serverConfigContext?: ServerConfigContext,
		projectConfigContext?: ProjectConfigContext,
		deps?: ProjectDependencies
	) {
		this.configured = configured;
		this.projectConfigContext = projectConfigContext;
		this.serverConfigContext = serverConfigContext;
		this.deps = deps;
	}
}

export class Bootstrap {
	private cwd: string;

	private projectConfigPath: string;

	private serverConfigPath: string;

	private packageJsonPath: string;

	private pkg: Pkg;

	private version: string;

	constructor(cwd: string, version: string) {
		this.cwd = cwd;
		this.version = version;
		this.projectConfigPath = path.resolve(this.cwd, 'wpackio.project.js');
		this.serverConfigPath = path.resolve(this.cwd, 'wpackio.server.js');
		this.packageJsonPath = path.resolve(this.cwd, './package.json');
		try {
			// eslint-disable-next-line global-require
			const pkg = require(this.packageJsonPath) as Pkg;
			this.pkg = pkg;
		} catch (e) {
			this.pkg = {
				name: '',
				homepage: '',
				author: '',
				license: 'UNLICENSED',
			};
		}
	}

	public async bootstrap(): Promise<InitResolve> {
		if (this.isConfigPresent('project')) {
			// If project config is present, then just configure the server
			if (this.isConfigPresent('server')) {
				// Server is also present, so just bail
				return Promise.reject(
					new Error('project is already bootstrapped.')
				);
			}
			// Configure the server
			const serverContext = await this.initServerConfig();
			return Promise.resolve(new InitResolve('server', serverContext));
		}
		// When project config is not present, we don't care about other stuff
		// We will override them. So call everything
		const projectContext = await this.initProjectConfig();
		const serverContext = await this.initServerConfig();
		const deps = this.configureScripts(projectContext);
		this.initSharedConfigFiles();
		return Promise.resolve(
			new InitResolve('project', serverContext, projectContext, deps)
		);
	}

	public async getUserInput(): Promise<inquirer.Answers> {
		const questions: inquirer.QuestionCollection = [
			// Ask type (if style.css present, then theme)
			{
				message: 'Type of WordPress Project (plugin or theme)',
				name: 'type',
				type: 'list',
				choices: ['plugin', 'theme'],
				default: this.fileExists(path.resolve(this.cwd, './style.css'))
					? 'theme'
					: 'plugin',
			},
			// Ask appName (auto-generate from package.json)
			{
				message: answers =>
					`Name of WordPress ${answers.type} (camelCase)`,
				name: 'appName',
				type: 'input',
				default: camelCase(this.pkg.name) || '',
				filter: camelCase,
			},
			// Ask slug (default, directory name)
			{
				message: answers =>
					`Slug (directory name) of your ${answers.type} (alphanumeric & dash)`,
				name: 'slug',
				type: 'input',
				default: slugify(path.basename(this.cwd)),
				filter: slugify,
			},
			// Ask outputPath (relative), defaults 'dist'
			{
				message: 'Output path (relative) of compiled files',
				name: 'outputPath',
				type: 'input',
				default: 'dist',
			},
			// Ask if react, sass, flow needed.
			{
				message: 'Check all the features/support you need',
				name: 'features',
				type: 'checkbox',
				choices: [
					{ name: 'React', value: 'hasReact' },
					{ name: 'Flowtype', value: 'hasFlow' },
					{ name: 'Typescript', value: 'hasTS' },
					{ name: 'Sass/Scss', value: 'hasSass' },
					{ name: 'Less', value: 'hasLess' },
				],
				default: ['hasReact', 'hasSass'],
			},
			// Ask glob pattern for .php files.
			{
				message: 'Glob pattern for watching PHP files for changes',
				name: 'watch',
				type: 'input',
				default: './inc|includes/**/*.php',
			},
		];

		return inquirer.prompt(questions);
	}

	/**
	 * Create project config file and return user provided context.
	 */
	private async initProjectConfig(): Promise<ProjectConfigContext> {
		// Return the resolved inquirer for further processing
		return this.getUserInput().then(answers => {
			let author = '';
			if (typeof this.pkg.author === 'string') {
				// eslint-disable-next-line prefer-destructuring
				author = this.pkg.author;
			} else if (typeof this.pkg.author === 'object') {
				author = `${this.pkg.author.name} (${this.pkg.author.email}) <${this.pkg.author.url}>`;
			}
			const context: ProjectConfigContext = {
				appName: answers.appName,
				type: answers.type,
				slug: answers.slug,
				author,
				license: this.pkg.license || 'UNLICENSED',
				outputPath: answers.outputPath,
				hasReact:
					answers.features.indexOf('hasReact') !== -1
						? 'true'
						: 'false',
				hasFlow:
					answers.features.indexOf('hasFlow') !== -1
						? 'true'
						: 'false',
				hasTS:
					answers.features.indexOf('hasTS') !== -1 ? 'true' : 'false',
				hasSass:
					answers.features.indexOf('hasSass') !== -1
						? 'true'
						: 'false',
				hasLess:
					answers.features.indexOf('hasLess') !== -1
						? 'true'
						: 'false',
				watch: answers.watch,
			};
			const source: string = fs
				.readFileSync(
					path.resolve(
						__dirname,
						'../../templates/wpackio.project.js.hbs'
					)
				)
				.toString();
			const compiler = handlebars.compile(source);
			fs.writeFileSync(this.projectConfigPath, compiler(context));
			return context;
		});
	}

	/**
	 * Create server config file and return user provided context.
	 */
	private async initServerConfig(): Promise<ServerConfigContext> {
		// 1. Ask proxy URL.
		const questions: inquirer.Question[] = [
			{
				name: 'proxy',
				message: 'URL (with http://) of local development server',
				type: 'input',
				default: 'http://localhost:8080',
			},
		];
		return inquirer.prompt(questions).then(answers => {
			const context: ServerConfigContext = {
				proxy: answers.proxy,
			};
			const source: string = fs
				.readFileSync(
					path.resolve(
						__dirname,
						'../../templates/wpackio.server.js.hbs'
					)
				)
				.toString();
			const compiler = handlebars.compile(source);
			fs.writeFileSync(this.serverConfigPath, compiler(context));
			return context;
		});
	}

	/**
	 * Create a default production ready (90%+ global coverage)
	 * browserlistrc file for your project and a postcss.config.js
	 * file.
	 */
	private initSharedConfigFiles(): void {
		fs.writeFileSync(
			path.resolve(this.cwd, '.browserslistrc'),
			'> 0.25%, not dead'
		);
		fs.writeFileSync(
			path.resolve(this.cwd, 'postcss.config.js'),
			`/* eslint-disable global-require, import/no-extraneous-dependencies */
module.exports = {
	// You can add more plugins and other postcss config
	// For more info see
	// <https://github.com/postcss/postcss-loader#configuration>
	// There is no need to use cssnano, webpack takes care of it!
	plugins: [require('autoprefixer')],
};
`
		);
	}

	/**
	 * Configure package.json file and figure which dependencies to install.
	 */
	private configureScripts(
		projectContext: ProjectConfigContext
	): ProjectDependencies {
		const packageFileData: Pkg = this.fileExists(this.packageJsonPath)
			? // eslint-disable-next-line global-require
			  require(this.packageJsonPath)
			: {
					name: projectContext.appName,
			  };
		// Check if script is already present
		const scripts: { [x: string]: string } = {
			build: 'wpackio-scripts build',
			start: 'wpackio-scripts start',
			bootstrap: 'wpackio-scripts bootstrap',
			archive: 'wpackio-scripts pack',
		};
		if (!packageFileData.scripts) {
			packageFileData.scripts = {};
		}
		Object.keys(scripts).forEach(script => {
			// Take a backup if the script is already defined
			// and doesn't equal to what we would like it to have.
			if (
				packageFileData.scripts &&
				packageFileData.scripts[script] != null &&
				packageFileData.scripts[script] !== scripts[script]
			) {
				packageFileData.scripts[`${script}-backup`] =
					packageFileData.scripts[script];
				packageFileData.scripts[script] = scripts[script];
			} else if (packageFileData.scripts) {
				// Otherwise define our own
				packageFileData.scripts[script] = scripts[script];
			}
		});

		// Add dependencies of @wpackio/entrypoint and @wpackio/scripts if needed
		const dependencies: string[] = ['@wpackio/entrypoint'];
		const devDependencies: string[] = [];

		// If @wpackio/scripts is not already present in devDependencies
		// Then push it. We do this check, because @wpackio/cli might already
		// have installed it during scaffolding.
		if (
			!packageFileData.devDependencies ||
			!packageFileData.devDependencies['@wpackio/scripts']
		) {
			devDependencies.push('@wpackio/scripts');
		}
		// If has Sass, then push node-sass
		if (projectContext.hasSass === 'true') {
			devDependencies.push('node-sass');
		}
		// if has Less, then push less
		if (projectContext.hasLess === 'true') {
			devDependencies.push('less');
		}
		// if has ts, then push fork-ts-checker-webpack-plugin
		if (projectContext.hasTS === 'true') {
			devDependencies.push('fork-ts-checker-webpack-plugin');
		}

		// Write it
		fs.writeFileSync(
			this.packageJsonPath,
			JSON.stringify(packageFileData, null, 2)
		);

		// Return dependencies
		return { dependencies, devDependencies };
	}

	private isConfigPresent(type: 'project' | 'server'): boolean {
		const filePath =
			type === 'project' ? this.projectConfigPath : this.serverConfigPath;
		return this.fileExists(filePath);
	}

	private fileExists(filePath: string): boolean {
		try {
			return fs.statSync(filePath).isFile();
		} catch (e) {
			if (e.code === 'ENOENT') {
				return false;
			}
			throw e;
		}
	}
}
