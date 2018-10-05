import webpack from 'webpack';
import { BannerConfig, FileConfig, ProjectConfig } from './project.config.default';
import { ServerConfig } from './server.config.default';
interface NormalizedEntry {
    [x: string]: string[];
}
interface Config {
    type: ProjectConfig['type'];
    slug: ProjectConfig['slug'];
    host: ServerConfig['host'];
    port: ServerConfig['port'];
    outputPath: ProjectConfig['outputPath'];
    hasReact: ProjectConfig['hasReact'];
    hasSass: ProjectConfig['hasSass'];
    bannerConfig: BannerConfig;
    alias?: webpack.Resolve['alias'];
    optimizeSplitChunks: ProjectConfig['optimizeSplitChunks'];
}
interface CommonWebpackConfig {
    context: webpack.Configuration['context'];
    devtool: webpack.Configuration['devtool'];
    target: webpack.Configuration['target'];
    watch: webpack.Configuration['watch'];
    mode: webpack.Configuration['mode'];
}
/**
 * A helper class to get different configuration of webpack.
 */
export declare class WebpackConfigHelper {
    private file;
    private isDev;
    private config;
    /**
     * Context directory, from where we read the stuff and put stuff.
     */
    private cwd;
    /**
     * Simulated NODE_ENV string, used internally and defined
     * in webpack with webpack.DefinePlugin.
     */
    private env;
    /**
     * Create an instance of GetEntryAndOutput class.
     */
    constructor(file: FileConfig, config: Config, cwd: string, isDev?: boolean);
    /**
     * Get webpack compatible entry configuration.
     *
     * The entry object has members which always has string[].
     * This is to ensure that we can insert the hot loader client
     * when necessary.
     */
    getEntry(): NormalizedEntry;
    /**
     * Get webpack compatible output object.
     */
    getOutput(): webpack.Output;
    /**
     * Get WebPack plugins, depending on development or production
     */
    getPlugins(): webpack.Plugin[];
    /**
     * Get module object for webpack, depending on environment.
     */
    getModule(): webpack.Module;
    /**
     * Get webpack compatible resolve property.
     */
    getResolve(): webpack.Resolve;
    /**
     * Get optimization for webpack.
     *
     * We optimize all chunks because
     */
    getOptimization(): webpack.Options.Optimization | undefined;
    /**
     * Get common configuration, depending on just environment.
     */
    getCommon(): CommonWebpackConfig;
}
export {};
