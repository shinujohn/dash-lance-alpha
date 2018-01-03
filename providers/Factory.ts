import * as nconf from "nconf";

/**
 * TODO: re-implement in an object oriented way
 */
class Factory {

    constructor() {
    }

    /**
     * Gets the given provider for file storage
     */
    static getStorageProvider() {
        // let Provider= require(`./storage/${name}`);
        // return new Provider(nconf.get('config:storage'));
        throw new Error("Not implemented");
    }

    /**
     * Gets the given provider for logging
     */
    static getLogger() {

        let configuration = nconf.get('config:logger');
        let Provider = require(`./logger/${configuration.type}`);
        return new Provider(configuration);
    }

    /**
     * Gets the configured database provider
     */
    static getDatabase() {

        let configuration = nconf.get('config:database');
        let Provider = require(`./database/${configuration.type}`);
        return new Provider(configuration);
    }
}

module.exports = Factory;