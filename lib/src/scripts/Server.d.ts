import { ProjectConfig } from '../config/project.config.default';
import { ServerConfig } from '../config/server.config.default';
export declare class Server {
    private projectConfig;
    private serverConfig;
    private cwd;
    private isServing;
    private bs?;
    private devMiddlewares?;
    /**
     * Create an instance.
     *
     * @param projectConfig Project configuration as recovered from user directory.
     * @param serverConfig Server configuration as recovered from user directory.
     */
    constructor(projectConfig: ProjectConfig, serverConfig: ServerConfig, cwd: string);
    /**
     * Serve the webpack/browserSync hybrid server.
     */
    serve(): void;
    /**
     * Stop the server and clean up all processes.
     */
    stop(): void;
    /**
     * Recompile everything through webpack.
     */
    refresh(): void;
}
