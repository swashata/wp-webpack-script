import { ProjectConfig } from '../config/project.config.default';
import { ServerConfig } from '../config/server.config.default';
export declare class Build {
    private projectConfig;
    private serverConfig;
    private cwd;
    constructor(projectConfig: ProjectConfig, serverConfig: ServerConfig, cwd: string);
    /**
     * Build the files.
     */
    build(): Promise<string>;
}
