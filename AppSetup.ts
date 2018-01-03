import * as express from "express";
import { Promise } from "rsvp";
import * as nconf from "nconf";
import * as shortId from "shortid";
import * as path from "path";
import * as fs from "fs";
import * as async from "async";

class Setup {

    /**
     * Initialise the setup 
     */
    init(app: express.Application) {
        return new Promise((resolve, reject) => {
            nconf.argv()
                .env()
                .file({ file: path.join(__dirname, 'config.json') });

            let setupFilesPath = path.join(__dirname, "setup");
            let setupFiles = fs.readdirSync(setupFilesPath);
            (<any>global).locator = (<any>global).locator || {};

            async.eachSeries(setupFiles, (setupFile, callback) => {

                if (path.extname(setupFile) === ".js") {
                    console.log('starting setup ' + setupFile);
                    (require("./setup/" + setupFile)).init(app).then(() => {

                        console.log('setup complete ' + setupFile);
                        callback();
                    }).catch((err: Object) => {
                        console.log('setup errored ' + setupFile);
                        console.error(err);
                        callback();
                    });;
                } else {
                    console.log('setup skipped ' + setupFile);
                    callback();
                }
            }, () => {

                let logger = (<any>global).locator.logger;
                logger.debug('App setup complete');
                console.log('App setup complete');
                resolve();
            });
        });
    }
}

module.exports = new Setup();