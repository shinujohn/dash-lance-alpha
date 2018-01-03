import { Logger } from "../../models/common/Logger"

class ConsoleLogger extends Logger {

    constructor() {
        super();
    }

    /**
     * Debug logs
     */
    debug(message: any) {
        console.log(message);
    }

    /**
     * Debug logs
     */
    info(message: any) {
        console.log(message);
    }

    /**
     * Error logs
     */
    error(message: any) {
        console.error(message);
    }
}

module.exports = ConsoleLogger;