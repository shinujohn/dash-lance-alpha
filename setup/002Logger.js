"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rsvp_1 = require("rsvp");
var Factory = require('./../providers/Factory');
var LoggerSetup = /** @class */ (function () {
    function LoggerSetup(name) {
        this.locator = null;
        this.locator = global.locator;
    }
    /**
     * Initialise the setup : connects to the mongdb
     */
    LoggerSetup.prototype.init = function () {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            _this.locator.logger = Factory.getLogger();
            resolve();
        });
    };
    return LoggerSetup;
}());
module.exports = new LoggerSetup(null);
