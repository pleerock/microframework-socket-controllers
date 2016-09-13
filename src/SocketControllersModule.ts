import {SocketControllersModuleConfig} from "./SocketControllersModuleConfig";
import {Module, ModuleInitOptions} from "microframework/Module";
import {useContainer} from "routing-controllers";
import {MicroFrameworkBootstrapper} from "microframework/MicroFrameworkBootstrapper";
import {createSocketServer} from "socket-controllers";
import {SocketControllersExports} from "./SocketControllersExports";

/**
 * socket-controllers module integration with microframework.
 */
export class SocketControllersModule implements Module {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private options: ModuleInitOptions;
    private configuration: SocketControllersModuleConfig;
    private framework: MicroFrameworkBootstrapper;

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    ignoreMissingDependencies = true;
    
    getName(): string {
        return "SocketControllersModule";
    }

    getDependentModules(): string[] {
        return ["ExpressModule"];
    }

    getConfigurationName(): string {
        return "socket-controllers";
    }

    isConfigurationRequired(): boolean {
        return true;
    }

    init(options: ModuleInitOptions, configuration: SocketControllersModuleConfig, dependentModules?: Module[], framework?: MicroFrameworkBootstrapper): void {
        this.options = options;
        this.configuration = configuration;
        this.framework = framework;
    }

    onBootstrap(): Promise<any> {

        const configuration: SocketControllersModuleConfig = Object.assign({}, this.configuration);
        configuration.controllerDirs = this.getSourcePaths(configuration.controllerDirs);

        useContainer(this.options.container);
        const io = createSocketServer(this.configuration.port, configuration);

        const socketControllersExports = this.options.container.get(SocketControllersExports);
        socketControllersExports.websocketsIo = io;

        return Promise.resolve();
    }

    afterBootstrap(): Promise<any> {
        return Promise.resolve();
    }

    onShutdown(): Promise<any> {
        return Promise.resolve();
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private getSourcePaths(dirs: string[]) {
        if (!dirs || !dirs.length)
            return [];
        
        return dirs.map(dir => this.options.frameworkSettings.srcDirectory + "/" + dir);
    }

}