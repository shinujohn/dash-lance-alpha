"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("express-jwt");
var nconf = require("nconf");
var rsvp_1 = require("rsvp");
var Member_1 = require("./../api/v1/Member");
var Connection_1 = require("./../api/v1/Connection");
var Setup_1 = require("./../utils/authentication/endpoints/Setup");
var Serializer_1 = require("serializer.ts/Serializer");
var ClientContext_1 = require("./../models/common/ClientContext");
var WebHostSetup = /** @class */ (function () {
    function WebHostSetup(name) {
        this.locator = null;
        this.locator = global.locator;
    }
    /**
     * Initialise the setup : connects to the mongdb
     */
    WebHostSetup.prototype.init = function (app) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            app.use(bodyParser.json());
            // Auth
            app.use(jwt({
                secret: nconf.get('config').jwtSecret,
                requestProperty: '_token',
                credentialsRequired: false,
                getToken: function fromHeaderOrQuerystring(req) {
                    var authToken = (req.headers.authorization || "").toString();
                    if (authToken.split(' ')[0] === 'Bearer') {
                        return authToken.split(' ')[1];
                    }
                    else if (req.query && req.query.token) {
                        return req.query.token;
                    }
                    else if (req.query && req.query.api_key) {
                        return req.query.api_key;
                    }
                    return null;
                }
            }), function (req, res, next) {
                var method = req.method;
                var token = req._token;
                if (!req._token
                    && req.method !== 'OPTIONS'
                    && req.url.indexOf("/api/") === 0) {
                    res.send(401);
                }
                else if (req._token) {
                    req.clientContext = Serializer_1.deserialize(ClientContext_1.ClientContext, req._token.principal);
                    next();
                }
                else {
                    next();
                }
            });
            var router = express.Router();
            Member_1.MemberApiSetup.init(router);
            Connection_1.ConnectionApiSetup.init(router);
            Setup_1.AuthenticationEndpointSetup.init(router);
            app.use(router);
            // Ping
            app.get('/ping', function (req, res) {
                var result = {
                    timestamp: new Date(),
                    database: {
                        status: "",
                        provider: nconf.get('config:database').type,
                    }
                };
                _this.locator.database.ping().then(function () {
                    result.database.status = "online";
                    res.send(result);
                }).catch(function (error) {
                    result.database.status = "error";
                    result.database.error = error;
                    res.send(result);
                });
            });
            var logger = _this.locator.logger;
            var port = process.env.PORT || '2020';
            app.listen(port, function () {
                logger.debug('app listening on port ' + port);
                app.emit("app-started");
                resolve();
            });
        });
    };
    return WebHostSetup;
}());
module.exports = new WebHostSetup(null);
