import * as nconf from "nconf";
import { Promise } from "rsvp";

import { Locator } from "./../models/common/Locator";

let Factory = require('./../providers/Factory');

class LoggerSetup {

    locator: Locator = null;
    constructor(name: string) {
        this.locator = (<any>global).locator;
    }

    /**
     * Initialise the setup : connects to the mongdb
     */
    init() {
        return new Promise((resolve, reject) => {
            this.locator.logger = Factory.getLogger();
            resolve();
        });
    }

}

module.exports = new LoggerSetup(null);