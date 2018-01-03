"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nconf = require("nconf");
/**
 * TODO: re-implement in an object oriented way
 */
var Factory = /** @class */ (function () {
    function Factory() {
    }
    /**
     * Gets the given provider for file storage
     */
    Factory.getStorageProvider = function () {
        // let Provider= require(`./storage/${name}`);
        // return new Provider(nconf.get('config:storage'));
        throw new Error("Not implemented");
    };
    /**
     * Gets the given provider for logging
     */
    Factory.getLogger = function () {
        var configuration = nconf.get('config:logger');
        var Provider = require("./logger/" + configuration.type);
        return new Provider(configuration);
    };
    /**
     * Gets the configured database provider
     */
    Factory.getDatabase = function () {
        var configuration = nconf.get('config:database');
        var Provider = require("./database/" + configuration.type);
        return new Provider(configuration);
    };
    return Factory;
}());
module.exports = Factory;
