import browserSync from 'browser-sync';
export interface ServerConfig {
    host?: string;
    proxy: string;
    port: number;
    ui: browserSync.Options['ui'];
    notify: boolean;
    open: boolean;
    ghostMode: browserSync.Options['ghostMode'];
}
export declare const serverConfigDefault: ServerConfig;
