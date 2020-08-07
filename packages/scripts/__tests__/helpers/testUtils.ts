import webpack from 'webpack';
import { ProjectConfig } from '../../src/config/project.config.default';
import { ServerConfig } from '../../src/config/server.config.default';
import { WebpackConfigHelperConfig } from '../../src/config/WebpackConfigHelper';

type babelLoaderModuleRules = {
	use: {
		loader: string;
		options?: {
			// tslint:disable-next-line:no-any
			[x: string]: any;
		};
	}[];
}[];
export const findWpackIoBabelOnJs = (
	modules: webpack.Module
): babelLoaderModuleRules => {
	return modules.rules.filter(rule => {
		const { test } = rule;
		return test !== undefined && test.toString() === '/\\.m?jsx?$/';
	}) as babelLoaderModuleRules;
};
export const findWpackIoBabelOnTs = (
	modules: webpack.Module
): babelLoaderModuleRules => {
	return modules.rules.filter(rule => {
		const { test } = rule;
		return test !== undefined && test.toString() === '/\\.tsx?$/';
	}) as babelLoaderModuleRules;
};
export const findWpackIoBabelOnNm = (
	modules: webpack.Module
): babelLoaderModuleRules => {
	return modules.rules.filter(rule => {
		const { include } = rule;
		return include !== undefined && include.toString() === '/node_modules/';
	}) as babelLoaderModuleRules;
};
export const findWpackIoBabelOnTJs = (
	modules: webpack.Module
): babelLoaderModuleRules => {
	return [...findWpackIoBabelOnJs(modules), ...findWpackIoBabelOnTs(modules)];
};
export function getConfigFromProjectAndServer(
	pCfg: ProjectConfig,
	sCfg: ServerConfig
): WebpackConfigHelperConfig {
	return {
		appName: pCfg.appName,
		type: pCfg.type,
		slug: pCfg.slug,
		host: sCfg.host,
		port: sCfg.port,
		outputPath: pCfg.outputPath,
		hasReact: pCfg.hasReact,
		disableReactRefresh: pCfg.disableReactRefresh,
		hasSass: pCfg.hasSass,
		hasLess: pCfg.hasLess,
		hasFlow: pCfg.hasFlow,
		bannerConfig: pCfg.bannerConfig,
		alias: pCfg.alias,
		optimizeSplitChunks: pCfg.optimizeSplitChunks,
		publicPath: `/wp-content/${pCfg.type}s/${pCfg.slug}/${pCfg.outputPath}/`,
		publicPathUrl: `//localhost/wp-content/${pCfg.type}s/${pCfg.slug}/${pCfg.outputPath}/`,
		errorOverlay: true,
		externals: pCfg.externals,
		useBabelConfig: false,
	};
}
