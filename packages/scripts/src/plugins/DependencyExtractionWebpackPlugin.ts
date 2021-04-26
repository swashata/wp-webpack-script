/* eslint-disable no-restricted-syntax */
import webpack, { Compiler } from 'webpack';
import json2php from 'json2php';
import path from 'path';
import fs from 'fs';

import {
	wpackioRequestToHandle,
	wpackioRequestsToExternals,
	defaultRequestToExternal,
	defaultRequestToHandle,
	lock,
	unlock,
} from '../dev-utils/ops';

type DependencyExtractionWebpackPluginOptions = {
	appDir: string;
	gutenbergOptimized: boolean;
};

export class DependencyExtractionWebpackPlugin {
	private externalizedDeps: Set<string>;
	private externalsPlugin: webpack.ExternalsPlugin;
	private compiler: webpack.Compiler | null = null;

	private assetDependenciesData: {
		path: string;
		content: string;
	}[];

	private options: DependencyExtractionWebpackPluginOptions;
	constructor(
		options: DependencyExtractionWebpackPluginOptions = {
			gutenbergOptimized: false,
			appDir: '',
		}
	) {
		this.options = {
			...options,
		};

		/*
		 * Track requests that are externalized.
		 *
		 * Because we don't have a closed set of dependencies, we need to track what has
		 * been externalized so we can recognize them in a later phase when the dependency
		 * lists are generated.
		 */
		this.externalizedDeps = new Set<string>();

		// Offload externalization work to the ExternalsPlugin.
		this.externalsPlugin = new webpack.ExternalsPlugin(
			'window',
			this.externalizeWpDeps.bind(this)
		);

		this.assetDependenciesData = [];
	}

	externalizeWpDeps(_context: any, request: string, callback: any) {
		let externalRequest = wpackioRequestsToExternals(request);

		if (this.options.gutenbergOptimized) {
			externalRequest = defaultRequestToExternal(request);
		}

		if (externalRequest) {
			this.externalizedDeps.add(request);

			return callback(null, externalRequest);
		}

		return callback();
	}

	mapRequestToDependency(request: string) {
		let requestToHandle = wpackioRequestToHandle;
		if (this.options.gutenbergOptimized) {
			requestToHandle = defaultRequestToHandle;
		}
		const scriptDependency = requestToHandle(request);
		if (scriptDependency) {
			return scriptDependency;
		}
		return request;
	}

	stringify(asset: any) {
		return `<?php return ${json2php(JSON.parse(JSON.stringify(asset)))};`;
	}

	/**
	 * Write the asset manifest to the file system.
	 *
	 * @param {string} destination
	 */
	async writeTo(destination: string, content: string) {
		await lock(destination);
		await fs.promises.mkdir(path.dirname(destination), { recursive: true });
		await fs.promises.writeFile(destination, content, { encoding: 'utf8' });
		await unlock(destination);
	}

	handleEmit(compilation: webpack.compilation.Compilation) {
		if (!this.compiler) {
			return;
		}

		// Process each entry point independently.
		for (const [
			entrypointName,
			entrypoint,
		] of compilation.entrypoints.entries()) {
			const entrypointExternalizedWpDeps = new Set();

			const processModule = (req: { userRequest: string }) => {
				const { userRequest } = req;
				if (this.externalizedDeps.has(userRequest)) {
					const scriptDependency = this.mapRequestToDependency(userRequest);
					entrypointExternalizedWpDeps.add(scriptDependency);
				}
			};

			// Search for externalized modules in all chunks.
			for (const chunk of entrypoint.chunks) {
				for (const chunkModule of chunk.modulesIterable) {
					processModule(chunkModule);
					// loop through submodules of ConcatenatedModule
					if (chunkModule.modules) {
						for (const concatModule of chunkModule.modules) {
							processModule(concatModule);
						}
					}
				}
			}

			const runtimeChunk = entrypoint.getRuntimeChunk();

			const assetData = {
				// Get a sorted array so we can produce a stable, stringified representation.
				dependencies: Array.from(entrypointExternalizedWpDeps).sort(),
				version: runtimeChunk.hash,
			};

			const assetString = this.stringify(assetData);

			const fileName = `${entrypointName.split('?', 2)[0]}.dependencies.wp.php`;
			const outputPath = path.resolve(
				this.compiler.outputPath,
				this.options.appDir,
				fileName
			);
			const assetPath = compilation.getPath(outputPath, {
				chunk: { name: 'dependencies.wp' },
				filename: fileName,
				contentHash: '',
			});
			this.assetDependenciesData.push({
				content: assetString,
				path: assetPath,
			});
		}
	}

	async handleAfterEmit() {
		if (!this.assetDependenciesData.length) {
			return;
		}
		for (const data of this.assetDependenciesData) {
			// eslint-disable-next-line no-await-in-loop
			await this.writeTo(data.path, data.content);
		}
	}

	apply(compiler: Compiler) {
		this.compiler = compiler;

		this.externalsPlugin.apply(compiler);

		compiler.hooks.emit.tap(this.constructor.name, this.handleEmit.bind(this));

		compiler.hooks.afterEmit.tapPromise(
			this.constructor.name,
			this.handleAfterEmit.bind(this)
		);
	}
}
