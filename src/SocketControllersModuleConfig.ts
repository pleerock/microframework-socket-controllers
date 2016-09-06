import {SocketControllersOptions} from "socket-controllers";

/**
 * Configuration for the module.
 */
export interface SocketControllersModuleConfig extends SocketControllersOptions {

    /**
     * Port on which websockets will run.
     */
    port: number;

}
