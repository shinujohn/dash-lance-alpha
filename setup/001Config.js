"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nconf = require("nconf");
var rsvp_1 = require("rsvp");
var ConfigSetup = /** @class */ (function () {
    function ConfigSetup(name) {
        this.locator = null;
        this.locator = global.locator;
    }
    /**
     * Initialise the setup
     */
    ConfigSetup.prototype.init = function () {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            _this.locator.config = nconf.get('config');
            resolve();
        });
    };
    return ConfigSetup;
}());
module.exports = new ConfigSetup(null);
