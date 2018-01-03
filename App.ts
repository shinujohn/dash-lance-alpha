import * as express from "express";
import * as glob from "glob";
import * as _ from "lodash";

let setup = require('./AppSetup');
let app = express();

setup.init(app).then(function () {
    console.log('All done, app running!');
}).catch((err: Object) => {
    console.error('App error');
    console.error(err);
});

module.exports = app;