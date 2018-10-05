import browserSync from 'browser-sync';
import webpack from 'webpack';
import DashboardPlugin from 'webpack-dashboard/plugin';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { CreateWebpackConfig } from '../config/CreateWebpackConfig';
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
		// Init browserSync
		const bs = browserSync.init();
		// Create configuration
		const webpackConfig = new CreateWebpackConfig(
			this.projectConfig,
			this.serverConfig,
			this.cwd,
			true
		).getConfig();
		// Init middleware and stuff
		const middlewares: browserSync.MiddlewareHandler[] = [];
		const devMiddlewares: webpackDevMiddleware.WebpackDevMiddleware[] = [];

		// If we are doing multi-compiler mode, then spin up webpack compiler
		// For each of the config. This is a hack that at-least makes hot reload
		// work fast for now. Otherwise, webpack-dev-middlewares will compile everything,
		// regardless of which entries are changed.
		// see: https://github.com/webpack/webpack-dev-middleware/issues/338
		// Create webpack compiler
		// Put them together
		if (Array.isArray(webpackConfig)) {
			webpackConfig.forEach((config: webpack.Configuration) => {
				const compiler = webpack(config);
				// We can not have dashboard plugin for webpack multi
				// compiler right now.
				// compiler.apply(new DashboardPlugin());
				const devMiddleware = webpackDevMiddleware(compiler, {
					stats: { colors: true },
					publicPath:
						config.output && config.output.publicPath
							? config.output.publicPath
							: '',
				});
				const hotMiddleware = webpackHotMiddleware(compiler);
				// Push them
				middlewares.push(devMiddleware);
				devMiddlewares.push(devMiddleware);
				middlewares.push(hotMiddleware);
			});
		} else {
			const compiler = webpack(webpackConfig);
			compiler.apply(new DashboardPlugin());
			const devMiddleware = webpackDevMiddleware(compiler, {
				stats: { colors: true },
				publicPath:
					webpackConfig.output && webpackConfig.output.publicPath
						? webpackConfig.output.publicPath
						: '',
			});
			const hotMiddleware = webpackHotMiddleware(compiler);
			// Push them
			middlewares.push(devMiddleware);
			devMiddlewares.push(devMiddleware);
			middlewares.push(hotMiddleware);
		}

		// Init browsersync
		bs.init({
			// We need to silent browserSync, otherwise might conflict with
			// webpack-dashboard
			logLevel: 'silent',
			port: this.serverConfig.port,
			ui: this.serverConfig.ui,
			proxy: {
				target: this.serverConfig.proxy,
			},
			// Middleware for webpack hot reload
			middleware: middlewares,
			host: this.serverConfig.host,
			open: this.serverConfig.open,
			notify: this.serverConfig.notify,
		});

		// Watch for user defined files, when it changes, reload
		// When that change, reload
		if (this.projectConfig.watch) {
			bs.watch(this.projectConfig.watch).on('change', bs.reload);
		}
		// Watch for our own manifest file
		bs.watch(`${this.projectConfig.outputPath}/manifest.json`).on(
			'change',
			bs.reload
		);

		// Mark server is running
		this.isServing = true;

		// Store the instances
		this.bs = bs;
		this.devMiddlewares = devMiddlewares;
	}

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
