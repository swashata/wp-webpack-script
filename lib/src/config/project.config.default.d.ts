import webpack from 'webpack';
/**
 * Configuration shape for banner. Inserted in the generated files on production.
 */
export interface BannerConfig {
    name: string;
    author: string;
    version: string;
    link: string;
    license: string;
    copyrightText: string;
    credit: boolean;
}
/**
 * Shape of `entry` property under `files`.
 */
export interface EntryConfig {
    [x: string]: string[] | string;
}
/**
 * Shape of single object under `files` property(array).
 */
export interface FileConfig {
    name: string;
    entry: EntryConfig;
    filename: string;
    webpackConfig?: webpack.Configuration;
}
/**
 * Main Project Config shape under `wpackio.project.js` file.
 */
export interface ProjectConfig {
    type: 'theme' | 'plugin';
    slug: string;
    bannerConfig: BannerConfig;
    files: FileConfig[];
    /**
     * The relative path of the output directory, w.r.t the directory
     * from where the script has been called.
     *
     * It has to be relative, otherwise we possibly can not make
     * hot-reload work.
     *
     * The script should be called from the root of your project. Otherwise
     * we can not know how to create the URL of assets.
     */
    outputPath: string;
    hasReact: boolean;
    hasSass: boolean;
    externals?: webpack.Configuration['externals'];
    alias?: webpack.Resolve['alias'];
    errorOverlay?: boolean;
    optimizeSplitChunks: boolean;
    watch?: string;
}
/**
 * The default configuration object.
 */
export declare const projectConfigDefault: ProjectConfig;
