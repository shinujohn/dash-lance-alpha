"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rsvp_1 = require("rsvp");
var Factory = require('./../providers/Factory');
var DatabaseSetup = /** @class */ (function () {
    function DatabaseSetup(name) {
        this.locator = null;
        this.locator = global.locator;
    }
    /**
     * Initialise the setup : connects to the mongdb
     */
    DatabaseSetup.prototype.init = function () {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            var database = Factory.getDatabase();
            database.init().then(function () {
                _this.locator.database = database;
                resolve();
            });
        });
    };
    return DatabaseSetup;
}());
module.exports = new DatabaseSetup(null);
