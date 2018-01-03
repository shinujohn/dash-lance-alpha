"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var setup = require('./AppSetup');
var app = express();
setup.init(app).then(function () {
    console.log('All done, app running!');
}).catch(function (err) {
    console.error('App error');
    console.error(err);
});
module.exports = app;
