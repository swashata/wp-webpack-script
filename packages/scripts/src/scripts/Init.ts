import fs from 'fs';
import handlebars from 'handlebars';
import inquirer from 'inquirer';
import path from 'path';

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
	hasSass: 'true' | 'false';
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

export class Init {
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
			// tslint:disable-next-line:non-literal-require
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
				return Promise.reject();
			} else {
				// Configure the server
				const serverContext = await this.initServerConfig();
				return Promise.resolve(
					new InitResolve('server', serverContext)
				);
			}
		} else {
			// When project config is not present, we don't care about other stuff
			// We will override them. So call everything
			const projectContext = await this.initProjectConfig();
			const serverContext = await this.initServerConfig();
			const deps = this.configureScripts(projectContext);
			return Promise.resolve(
				new InitResolve('project', serverContext, projectContext, deps)
			);
		}
	}

	/**
	 * Create project config file and return user provided context.
	 */
	private async initProjectConfig(): Promise<ProjectConfigContext> {
		const questions: inquirer.Question[] = [
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
				message: answers => `Name of WordPress ${answers.type}`,
				name: 'appName',
				type: 'input',
				default: this.pkg.name || '',
			},
			// Ask slug (default, directory name)
			{
				message: answers =>
					`Slug (directory name) of your ${answers.type}`,
				name: 'slug',
				type: 'input',
				default: path.basename(this.cwd),
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
					{ name: 'Sass/Scss', value: 'hasSass' },
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

		// Return the resolved inquirer for further processing
		return inquirer.prompt(questions).then(answers => {
			let author = '';
			if (typeof this.pkg.author === 'string') {
				author = this.pkg.author;
			} else if (typeof this.pkg.author === 'object') {
				author = `${this.pkg.author.name} (${this.pkg.author.email}) <${
					this.pkg.author.url
				}>`;
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
				hasSass:
					answers.features.indexOf('hasSass') !== -1
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
	 * Configure package.json file and figure which dependencies to install.
	 */
	private configureScripts(
		projectContext: ProjectConfigContext
	): ProjectDependencies {
		const packageFileData: Pkg = this.fileExists(this.packageJsonPath)
			? // tslint:disable-next-line:non-literal-require
			  require(this.packageJsonPath)
			: {
					name: '',
			  };
		// Check if script is already present
		const scripts: { [x: string]: string } = {
			build: 'wpackio-scripts build',
			start: 'wpackio-scripts start',
			bootstrap: 'wpackio-scripts init',
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

		// Add dependencies of @wpackio/scripts if needed
		const dependencies: string[] = [];
		const devDependencies: string[] = [];
		if (
			!packageFileData.dependencies ||
			!packageFileData.dependencies['@wpackio/scripts']
		) {
			dependencies.push('@wpackio/scripts');
		}
		// If has Sass
		if (projectContext.hasSass === 'true') {
			devDependencies.push('node-sass');
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
			} else {
				throw e;
			}
		}
	}
}
