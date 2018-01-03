export abstract class Logger {

    constructor() {
    }

    /**
     * Debug logs
     */
    abstract debug(message: any): void;

    /**
     * Debug logs
     */
    abstract info(message: any): void;
    
    /**
     * Error logs
     */
    abstract error(message: any): void;
}
