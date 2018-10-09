import browserSync from 'browser-sync';
import devIp from 'dev-ip';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import openBrowser from 'react-dev-utils/openBrowser';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import {
	CreateWebpackConfig,
	WpackConfig,
} from '../config/CreateWebpackConfig';
import { ProjectConfig } from '../config/project.config.default';
import { ServerConfig } from '../config/server.config.default';

/**
 * Create a development server with file watching, hot reload and live reload.
 * Everything is done with browserSync and webpack middleware.
 */
export class Server {
	private projectConfig: ProjectConfig;
	private serverConfig: ServerConfig;
	private cwd: string;

	private isServing: boolean = false;

	private bs?: browserSync.BrowserSyncInstance;
	private devMiddlewares?: webpackDevMiddleware.WebpackDevMiddleware[];

	private webpackConfig: CreateWebpackConfig;
	private isBrowserOpened: boolean = false;

	/**
	 * Create an instance.
	 *
	 * @param projectConfig Project configuration as recovered from user directory.
	 * @param serverConfig Server configuration as recovered from user directory.
	 */
	constructor(
		projectConfig: ProjectConfig,
		serverConfig: ServerConfig,
		cwd: string
	) {
		this.projectConfig = projectConfig;
		this.serverConfig = serverConfig;
		this.cwd = cwd;
		// Override serverConfig host if it is undefined
		if (!this.serverConfig.host) {
			const possibleHost = devIp();
			if (possibleHost) {
				this.serverConfig.host = possibleHost[0];
			}
		}
		// Create the webpackConfig
		this.webpackConfig = new CreateWebpackConfig(
			this.projectConfig,
			this.serverConfig,
			this.cwd,
			true
		);
	}

	/**
	 * Serve the webpack/browserSync hybrid server.
	 */
	public serve(): void {
		// If server is already running, then throw
		if (this.isServing) {
			throw new Error(
				'Can not serve while the server is already running.'
			);
		}
		// Create browserSync Instance
		const bs = browserSync.create();

		// Init middleware and stuff
		const middlewares: browserSync.MiddlewareHandler[] = [];
		const devMiddlewares: webpackDevMiddleware.WebpackDevMiddleware[] = [];

		// We can have multi-compiler or single compiler, depending on the config
		// we get. And both of them works for dev and hot middleware.
		let compiler: webpack.Compiler | webpack.MultiCompiler;
		if (this.webpackConfig.isMultiCompiler()) {
			compiler = webpack(
				this.webpackConfig.getWebpackConfig() as webpack.Configuration[]
			);
		} else {
			compiler = webpack(
				this.webpackConfig.getWebpackConfig() as webpack.Configuration
			);
		}

		// tslint:disable:no-object-literal-type-assertion
		const devMiddleware = webpackDevMiddleware(compiler, {
			stats: false,
			publicPath: this.webpackConfig.getPublicPath(),
			logLevel: 'silent',
			logTime: false,
		} as webpackDevMiddleware.Options);

		const hotMiddleware = webpackHotMiddleware(compiler, {
			// Now because we are already using publicPath(dynamicPublicPath = true) in client
			// we have to assume that it is prefixed. That's why we prefix it in the server too.
			// Because it could be multi-compiler, I guess it will just work fine since we are
			// passing in the `name` too, as documented.
			path: `${this.webpackConfig.getHmrPath()}`,
			// We don't want any noise
			log: false,
		});
		// Push them
		middlewares.push(devMiddleware);
		devMiddlewares.push(devMiddleware);
		middlewares.push(hotMiddleware);

		// Init browsersync
		bs.init({
			logLevel: 'silent',
			port: this.serverConfig.port,
			ui: this.serverConfig.ui,
			proxy: {
				target: this.serverConfig.proxy,
			},
			// Middleware for webpack hot reload
			middleware: middlewares,
			host: this.serverConfig.host,
			open: false, // We don't want to open right away
			notify: this.serverConfig.notify,
		});

		// Now open the browser, when first compilation is done
		if ((compiler as webpack.MultiCompiler).compilers) {
			// Apply hooks on each one
			(compiler as webpack.MultiCompiler).compilers.forEach(
				this.addHooks
			);
		} else {
			// Apply hook on the single one
			this.addHooks(compiler as webpack.Compiler);
		}

		// Watch for user defined files, when it changes, reload
		// When that change, reload
		if (this.projectConfig.watch) {
			bs.watch(this.projectConfig.watch).on('change', bs.reload);
		}
		// We don't need to watch for manifest, because if user is changing
		// Config, then she does need to restart. It won't be picked up
		// automatically by node.

		// Mark server is running
		this.isServing = true;

		// Store the instances
		this.bs = bs;
		this.devMiddlewares = devMiddlewares;
	}

	/**
	 * Add hooks to compiler instances.
	 */
	public addHooks = (compiler: webpack.Compiler): void => {
		const { done, afterEmit } = compiler.hooks;
		const serverUrl = this.webpackConfig.getServerUrl();

		// Open browser on last emit of first compilation
		// Q: How do I know this is the last emit, for multi-compiler
		// Maybe I can count?
		afterEmit.tap('wpackio-hot-server', () => {
			if (!this.isBrowserOpened) {
				// tslint:disable:no-http-string
				console.log(`opening url http:${serverUrl}`);
				openBrowser(`http:${serverUrl}`);
				this.isBrowserOpened = true;
			}
		});

		// Show stats
		done.tap('wpackio-hot-server', stats => {
			const raw = stats.toJson('verbose');
			const messages = formatWebpackMessages(raw);
			if (!messages.errors.length && !messages.warnings.length) {
				// Here be pretty stuff
				// console.log(
				// 	stats.toString({
				// 		colors: true,
				// 		modules: false,
				// 		chunks: false,
				// 	})
				// );
			}
			if (messages.errors.length) {
				console.log('Failed to compile.');
				messages.errors.forEach(e => console.log(e));

				return;
			}
			if (messages.warnings.length) {
				console.log('Compiled with warnings.');
				messages.warnings.forEach(w => console.log(w));
			}
		});
	};
	/**
	 * Stop the server and clean up all processes.
	 */
	public stop(): void {
		// throw if server is not running
		if (!this.isServing) {
			throw new Error(
				'Can not stop if the server is not running already. Call server.serve() first.'
			);
		}
		// First stop browserSync
		if (this.bs) {
			this.bs.exit();
		}
		// Now stop all webpack compiler
		if (this.devMiddlewares) {
			this.devMiddlewares.forEach(devMiddleware => {
				devMiddleware.close();
			});
		}
		// All good
	}

	/**
	 * Recompile everything through webpack.
	 */
	public refresh(): void {
		// throw if server is not running
		if (!this.isServing) {
			throw new Error(
				'Can not refresh if the server is not running already. Call server.serve() first.'
			);
		}
		// Refresh all devMiddlewares
		if (this.devMiddlewares) {
			this.devMiddlewares.forEach(devMiddleware => {
				devMiddleware.invalidate();
			});
		}
		// We probably? don't need anything with browserSync?
	}
}
