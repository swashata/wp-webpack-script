import camelCase from 'camelcase';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import slugify from 'slugify';
import prompts from 'prompts';
import { getProjectConfig } from '../config/getProjectAndServerConfig';
import { hasTypeScript } from '../dev-utils/ops';

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
	public configured: 'project' | 'server' | 'deps';

	public projectConfigContext?: ProjectConfigContext;

	public serverConfigContext?: ServerConfigContext;

	public deps?: ProjectDependencies;

	constructor(
		configured: 'project' | 'server' | 'deps',
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
			// eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
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
			const config = getProjectConfig(this.cwd).projectConfig;
			const projectContext: ProjectConfigContext = {
				appName: config.appName,
				author: '',
				hasFlow: config.hasFlow ? 'true' : 'false',
				hasLess: config.hasLess ? 'true' : 'false',
				hasReact: config.hasReact ? 'true' : 'false',
				hasSass: config.hasSass ? 'true' : 'false',
				hasTS: hasTypeScript(this.cwd)[0] ? 'true' : 'false',
				license: '',
				outputPath: config.outputPath,
				slug: config.slug,
				type: config.type,
				watch: '',
			};
			const deps = this.getDependencies(projectContext);
			// If project config is present, then just configure the server
			if (this.isConfigPresent('server')) {
				// since server config is present, we make a dep type resolver
				return Promise.resolve(
					new InitResolve('deps', undefined, undefined, deps)
				);
			}
			// Configure the server
			const serverContext = await this.initServerConfig();
			return Promise.resolve(
				new InitResolve('server', serverContext, projectContext, deps)
			);
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

	public async getUserInput() {
		type promptAnswerKeys =
			| 'type'
			| 'appName'
			| 'slug'
			| 'outputPath'
			| 'features'
			| 'watch';
		// 'plugin', 'theme'
		const isTheme = this.fileExists(path.resolve(this.cwd, './style.css'));
		const questions: prompts.PromptObject<promptAnswerKeys>[] = [
			// Ask type (if style.css present, then theme)
			{
				message: 'Type of WordPress Project (plugin or theme)',
				name: 'type',
				type: 'select',
				choices: [
					{
						title: 'Plugin',
						value: 'plugin',
					},
					{
						title: 'Theme',
						value: 'theme',
					},
				],
				initial: isTheme ? 1 : 0,
				hint: isTheme
					? 'We think yours is a THEME'
					: 'We think yours is a PLUGIN',
			},
			// Ask appName (auto-generate from package.json)
			{
				message: prev => {
					return `Name of WordPress ${prev} (camelCase)`;
				},
				name: 'appName',
				type: 'text',
				initial: camelCase(this.pkg.name) || '',
				format: (val: string) => camelCase(val),
			},
			// Ask slug (default, directory name)
			{
				message: answers =>
					`Slug (directory name) of your ${answers.type} (alphanumeric & dash)`,
				name: 'slug',
				type: 'text',
				initial: slugify(path.basename(this.cwd)),
				format: (val: string) => slugify(val),
			},
			// Ask outputPath (relative), defaults 'dist'
			{
				message: 'Output path (relative) of compiled files',
				name: 'outputPath',
				type: 'text',
				initial: 'dist',
			},
			// Ask if react, sass, flow needed.
			{
				message: 'Check all the features/support you need',
				name: 'features',
				type: 'multiselect',
				choices: [
					{ title: 'React', value: 'hasReact', selected: true },
					{ title: 'Flowtype', value: 'hasFlow' },
					{ title: 'Typescript', value: 'hasTS' },
					{ title: 'Sass/Scss', value: 'hasSass' },
					{ title: 'Less', value: 'hasLess', selected: true },
				],
				hint: '- Space to select. ⏎ Return to submit',
			},
			// Ask glob pattern for .php files.
			{
				message: 'Glob pattern for watching PHP files for changes',
				name: 'watch',
				type: 'text',
				initial: './inc|includes/**/*.php',
			},
		];

		return prompts(questions);
	}

	/**
	 * Create project config file and return user provided context.
	 */
	private async initProjectConfig(): Promise<ProjectConfigContext> {
		// Return the resolved prompts for further processing
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
					answers.features.indexOf('hasReact') !== -1 ? 'true' : 'false',
				hasFlow: answers.features.indexOf('hasFlow') !== -1 ? 'true' : 'false',
				hasTS: answers.features.indexOf('hasTS') !== -1 ? 'true' : 'false',
				hasSass: answers.features.indexOf('hasSass') !== -1 ? 'true' : 'false',
				hasLess: answers.features.indexOf('hasLess') !== -1 ? 'true' : 'false',
				watch: answers.watch,
			};
			const source: string = fs
				.readFileSync(
					path.resolve(__dirname, '../../templates/wpackio.project.js.hbs')
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
		type promptAnswerKeys = 'proxy';
		// 1. Ask proxy URL.
		const questions: prompts.PromptObject<promptAnswerKeys>[] = [
			{
				name: 'proxy',
				message: 'URL (with http://) of local development server',
				type: 'text',
				initial: 'http://localhost:8080',
			},
		];
		return prompts(questions).then(answers => {
			const context: ServerConfigContext = {
				proxy: answers.proxy,
			};
			const source: string = fs
				.readFileSync(
					path.resolve(__dirname, '../../templates/wpackio.server.js.hbs')
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

		// Write it
		fs.writeFileSync(
			this.packageJsonPath,
			JSON.stringify(packageFileData, null, 2)
		);

		// Return dependencies
		return this.getDependencies(projectContext);
	}

	private getDependencies(projectContext: ProjectConfigContext) {
		const packageFileData: Pkg = this.fileExists(this.packageJsonPath)
			? // eslint-disable-next-line global-require
			  require(this.packageJsonPath)
			: {
					name: projectContext.appName,
			  };
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
		// If has Sass, then push sass (dart sass)
		if (projectContext.hasSass === 'true') {
			devDependencies.push('sass');
		}
		// if has Less, then push less
		if (projectContext.hasLess === 'true') {
			devDependencies.push('less');
		}
		// if has ts, then push fork-ts-checker-webpack-plugin
		if (projectContext.hasTS === 'true') {
			devDependencies.push('typescript');
			devDependencies.push('fork-ts-checker-webpack-plugin');
		}

		// always push postcss, starting version 6.0
		devDependencies.push('postcss');

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
