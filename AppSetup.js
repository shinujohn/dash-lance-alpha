"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rsvp_1 = require("rsvp");
var nconf = require("nconf");
var path = require("path");
var fs = require("fs");
var async = require("async");
var Setup = /** @class */ (function () {
    function Setup() {
    }
    /**
     * Initialise the setup
     */
    Setup.prototype.init = function (app) {
        return new rsvp_1.Promise(function (resolve, reject) {
            nconf.argv()
                .env()
                .file({ file: path.join(__dirname, 'config.json') });
            var setupFilesPath = path.join(__dirname, "setup");
            var setupFiles = fs.readdirSync(setupFilesPath);
            global.locator = global.locator || {};
            async.eachSeries(setupFiles, function (setupFile, callback) {
                if (path.extname(setupFile) === ".js") {
                    console.log('starting setup ' + setupFile);
                    (require("./setup/" + setupFile)).init(app).then(function () {
                        console.log('setup complete ' + setupFile);
                        callback();
                    }).catch(function (err) {
                        console.log('setup errored ' + setupFile);
                        console.error(err);
                        callback();
                    });
                    ;
                }
                else {
                    console.log('setup skipped ' + setupFile);
                    callback();
                }
            }, function () {
                var logger = global.locator.logger;
                logger.debug('App setup complete');
                console.log('App setup complete');
                resolve();
            });
        });
    };
    return Setup;
}());
module.exports = new Setup();
