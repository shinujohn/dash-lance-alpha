import * as nconf from "nconf";
import { Promise } from "rsvp";
import { Locator } from "./../models/common/Locator";

class ConfigSetup {

    locator: Locator = null;
    constructor(name: string) {
        this.locator = (<any>global).locator;
    }

    /**
     * Initialise the setup 
     */
    init() {
        return new Promise((resolve, reject) => {
            this.locator.config = nconf.get('config');
            resolve();
        });
    }

}

module.exports = new ConfigSetup(null);