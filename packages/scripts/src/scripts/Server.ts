import browserSync from 'browser-sync';
import devIp from 'dev-ip';
import open from 'open';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import logSymbols from 'log-symbols';
import inquirer from 'inquirer';

import {
	formatWebpackMessages,
	typescriptFormatter,
	issueType,
} from '../dev-utils';
import { CreateWebpackConfig } from '../config/CreateWebpackConfig';
import { ProjectConfig } from '../config/project.config.default';
import { ServerConfig } from '../config/server.config.default';
import { hasTypeScript } from '../config/WebpackConfigHelper';
import { WpackioError } from '../errors/WpackioError';

interface FormattedMessage {
	errors: string[];
	warnings: string[];
}

interface Callbacks {
	invalid(): void;
	done(stats: webpack.Stats): void;
	firstCompile(stats: webpack.Stats | undefined): void;
	onError(err: FormattedMessage): void;
	onWarn(warn: FormattedMessage): void;
	onBsChange(file: string): void;
	onEmit(stats: webpack.Stats): void;
	onTcStart(): void;
	onTcEnd(err: FormattedMessage): void;
	onWatching(): void;
	onInfo(msg: string, symbol: string): void;
}

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

	private firstCompileCompleted: boolean = false;

	private callbacks: Callbacks;

	private hasTs: boolean;

	private tsConfigPath: string;

	private priorFirstCompileTsMessage: Promise<FormattedMessage>[] = [];

	static async getEntriesSelection(
		projectConfig: ProjectConfig
	): Promise<number[]> {
		const questions: inquirer.QuestionCollection = [
			{
				message: 'Select projects to start',
				name: 'entries',
				type: 'checkbox',
				choices: projectConfig.files.map((f, i) => ({
					value: i,
					name: `[${i}] ${f.name || `CONFIG ${i}`}`,
				})),
			},
		];

		const answer = await inquirer.prompt(questions);
		return answer.entries.map((i: string) => Number.parseInt(i, 10));
	}

	/**
	 * Create an instance.
	 *
	 * @param projectConfig Project configuration as recovered from user directory.
	 * @param serverConfig Server configuration as recovered from user directory.
	 */
	constructor(
		projectConfig: ProjectConfig,
		serverConfig: ServerConfig,
		cwd: string,
		callbacks: Callbacks,
		entries?: number[]
	) {
		this.projectConfig = projectConfig;
		this.serverConfig = serverConfig;
		this.cwd = cwd;
		this.callbacks = callbacks;
		// Override serverConfig host if it is undefined
		if (!this.serverConfig.host) {
			const possibleHost = devIp();
			if (possibleHost) {
				// eslint-disable-next-line prefer-destructuring
				this.serverConfig.host = possibleHost[0];
			}
		}
		// Create the webpackConfig
		this.webpackConfig = new CreateWebpackConfig(
			this.projectConfig,
			this.serverConfig,
			this.cwd,
			true,
			entries
		);
		// Check if project has typescript
		const [hasTs, tsConfigPath] = hasTypeScript(this.cwd);
		this.hasTs = hasTs;
		this.tsConfigPath = tsConfigPath;
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
		let compiler: webpack.ICompiler;
		if (this.webpackConfig.isMultiCompiler()) {
			compiler = webpack(
				this.webpackConfig.getWebpackConfig() as webpack.Configuration[]
			);
		} else {
			compiler = webpack(
				this.webpackConfig.getWebpackConfig() as webpack.Configuration
			);
		}

		// Apply only the done hook for the single/multi compiler
		// we pass as webpack.Compiler, because ts don't like it otherwise
		this.addHooks(compiler as webpack.Compiler);

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
		// BS options
		let bsOptions: browserSync.Options = {
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
			ghostMode:
				this.serverConfig.ghostMode === undefined
					? {
							clicks: true,
							forms: true,
							scroll: true,
					  }
					: this.serverConfig.ghostMode,
			snippetOptions: {
				whitelist: [
					// Add WP REST API
					'/wp-json/**',
					// Add AJAX calls
					'/wp-admin/admin-ajax.php',
				],
			},
		};
		if (this.serverConfig.bsOverride) {
			bsOptions = {
				...bsOptions,
				...this.serverConfig.bsOverride,
			};
		}

		// Open browser on first build
		devMiddleware.waitUntilValid(stats => {
			if (!this.firstCompileCompleted) {
				this.firstCompileCompleted = true;
				this.callbacks.firstCompile(stats);
				// Some stuff for async ts checking
				if (this.priorFirstCompileTsMessage.length) {
					const delayedMsg = setTimeout(() => {
						this.callbacks.onTcStart();
					}, 100);
					Promise.all(this.priorFirstCompileTsMessage)
						.then(msgs => {
							clearTimeout(delayedMsg);
							msgs.forEach(msg => {
								this.callbacks.onTcEnd(msg);
								this.callbacks.onWatching();
							});
						})
						.catch(e => {
							console.log(e);
							console.log('first compile ts message failed');
							// do nothing because it might be that it has been cancelled.
						});
				} else {
					this.callbacks.onWatching();
				}
			}
			this.openBrowser();
		});

		bs.init(bsOptions);
		// Watch for user defined files, when it changes, reload
		// When that change, reload
		if (this.projectConfig.watch) {
			bs.watch(this.projectConfig.watch as string).on(
				'change',
				(file: string) => {
					this.callbacks.onBsChange(file);
					bs.reload();
				}
			);
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
	 * Get URL to network IP where the server is alive.
	 */
	public getServerUrl(): string {
		return `http:${this.webpackConfig.getServerUrl()}`;
	}

	/**
	 * Get URL to browserSync UI.
	 */
	public getBsUiUrl(): string | boolean {
		const { host, ui } = this.serverConfig;
		if (!ui) {
			return false;
		}
		return `http://${host || 'localhost'}:${ui.port || '8080'}`;
	}

	/**
	 * Open browser if not already opened and config says so.
	 */
	public async openBrowser() {
		const serverUrl = this.getServerUrl();
		if (!this.isBrowserOpened && this.serverConfig.open) {
			this.callbacks.onInfo(`trying to open URL`, logSymbols.info);
			try {
				await open(serverUrl, {});
				this.callbacks.onInfo(
					`opened browser with URL ${serverUrl}`,
					logSymbols.success
				);
			} catch (e) {
				// do nothing
				this.callbacks.onInfo(
					`could not open browser`,
					logSymbols.error
				);
			}
			this.isBrowserOpened = true;
		}
	}

	/**
	 * Add hooks to compiler instances.
	 */
	public addHooks = (compiler: webpack.Compiler): void => {
		// We tap into done and invalid hooks, which are present
		// in both single and multi-compiler instances.
		const { done, invalid } = compiler.hooks;

		// When compilation is done, call the callback
		done.tap('wpackIoServerDone', stats => {
			// don't do anything if firstCompile hasn't run
			if (this.firstCompileCompleted) {
				const raw = stats.toJson({
					all: false,
					warnings: true,
					errors: true,
				});
				const messages = formatWebpackMessages(raw);
				// further remove the absolute path
				messages.errors = messages.errors.map(itm =>
					itm.split(this.cwd).join('.')
				);
				messages.warnings = messages.warnings.map(itm =>
					itm.split(this.cwd).join('.')
				);
				if (!messages.errors.length && !messages.warnings.length) {
					// Here be pretty stuff.
					this.callbacks.done(stats);
				}
				if (messages.errors.length) {
					this.callbacks.onError(messages);
				} else if (messages.warnings.length) {
					this.callbacks.onWarn(messages);
				}

				this.callbacks.onEmit(stats);

				if (!this.hasTs) {
					this.callbacks.onWatching();
				}
			}
		});

		// On compile start
		invalid.tap('wpackIoServerInvalid', () => {
			this.callbacks.invalid();
		});

		// some additional work for typescript
		// heavily based on create-react-script

		// Some more hooks on typescript
		if (this.hasTs) {
			// try to get the fork ts checker webpack plugin
			let ForkTsCheckerWebpackPlugin: any;
			try {
				// eslint-disable-next-line global-require, import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
				ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
			} catch (e) {
				throw new WpackioError(
					'please install fork-ts-checker-webpack-plugin package'
				);
			}

			// Now here's the tricky thing, it could be either single compiler
			// or multi-compiler
			if ('compilers' in compiler) {
				// It is a multi-compiler instance
				// so tap the hook for every instance
				((compiler as any).compilers as webpack.Compiler[]).forEach(
					sCompiler => {
						this.addTsHooks(sCompiler, ForkTsCheckerWebpackPlugin);
					}
				);
			} else {
				// single compiler instance, so just tap one
				this.addTsHooks(compiler, ForkTsCheckerWebpackPlugin);
			}
		}
	};

	private addTsHooks = (compiler: webpack.Compiler, plugin: any): void => {
		const { beforeCompile, done } = compiler.hooks;
		const tsHooks = plugin.getCompilerHooks(compiler);

		let tsMessagesPromise: Promise<FormattedMessage>;
		let tsMessagesResolver: (msgs: FormattedMessage) => void;

		// Tap before run begins on watch mode to create a new tsmessage promise
		beforeCompile.tap('wpackIoServerBeforeCompileTs', () => {
			if (!this.firstCompileCompleted) {
				// if this first compilation isn't done yet, and there is a pending
				// resolver, then call it with empty message. For some reason, during
				// initialization, beforeCompile seems to be called multiple times.
				// This is how we cancel the previous resolver and start fresh
				if (tsMessagesResolver) {
					tsMessagesResolver({
						errors: [],
						warnings: [],
					});
				}
			}
			tsMessagesPromise = new Promise(resolve => {
				tsMessagesResolver = msgs => resolve(msgs);
			});
			// silently reject the previous promise
			// although it should never happen
			tsMessagesPromise.catch(() => {
				// do nothing because it might've been cancelled
			});
		});

		tsHooks.issues.tap('afterTypeScriptCheck', (issues: issueType[]) => {
			const format = (message: any) =>
				typescriptFormatter(message, this.cwd);

			tsMessagesResolver({
				errors: issues
					.filter(msg => msg.severity === 'error')
					.map(format),
				warnings: issues
					.filter(msg => msg.severity === 'warning')
					.map(format),
			});
		});

		// Once compilation is done, then show the message
		done.tap('wpackIoServerDoneTs', async () => {
			if (this.firstCompileCompleted) {
				const delayedMsg = setTimeout(() => {
					this.callbacks.onTcStart();
				}, 100);
				try {
					const messages = await tsMessagesPromise;

					// don't display the delayed message of "waiting for type result"
					clearTimeout(delayedMsg);
					// update the console by passing to the handler
					this.callbacks.onTcEnd(messages);
					this.callbacks.onWatching();
				} catch (e) {
					// do thing, since it was cancelled
				}
			} else {
				this.priorFirstCompileTsMessage.push(tsMessagesPromise);
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
