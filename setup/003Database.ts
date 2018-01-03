import * as  shortId from "shortid";
import * as nconf from "nconf";
import { Promise } from "rsvp";
import { Database } from "./../models/common/Database";
import { Locator } from "./../models/common/Locator";

let Factory = require('./../providers/Factory');

class DatabaseSetup {

    locator: Locator = null;
    constructor(name: string) {
        this.locator = (<any>global).locator;
    }


    /**
     * Initialise the setup : connects to the mongdb
     */
    init() {
        return new Promise((resolve, reject) => {

            let database = Factory.getDatabase();
            database.init().then(() => {
                this.locator.database = database;
                resolve();
            });
        });
    }

}

module.exports = new DatabaseSetup(null);