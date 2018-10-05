import webpack from 'webpack';
import { ProjectConfig } from './project.config.default';
import { ServerConfig } from './server.config.default';
/**
 * Create the final webpack config through this class.
 */
export declare class CreateWebpackConfig {
    private projectConfig;
    private serverConfig;
    private cwd;
    private isDev;
    /**
     * Create an instance of GetWebpackConfig class.
     *
     * @param projectConfig Project configuration as recovered from user directory.
     * @param serverConfig Server configuration as recovered from user directory.
     * @param isDev Whether this is development mode.
     */
    constructor(projectConfig: ProjectConfig, serverConfig: ServerConfig, cwd: string, isDev?: boolean);
    /**
     * Get configuration object to feed to webpack.
     *
     * Depending on the project configuration, it could be for single compiler
     * as well as multi compiler.
     *
     * If `projectConfig.files` has length === 1, then it would be a single compiler
     * otherwise, it would be for multi compiler.
     */
    getConfig(): webpack.Configuration | webpack.Configuration[];
    /**
     * Get Webpack Configuration for single compiler mode.
     *
     * @param file Single file object.
     */
    private getSingleCompilerConfig;
}
