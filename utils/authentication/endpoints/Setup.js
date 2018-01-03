"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Authentication_1 = require("./../Authentication");
var ClientContext_1 = require("./../../../models/common/ClientContext");
var AuthenticationEndpointSetup = /** @class */ (function () {
    function AuthenticationEndpointSetup() {
    }
    AuthenticationEndpointSetup.init = function (router) {
        router.post("/auth/login", function (req, res) {
            var logger = global.locator.logger;
            var email = req.body.username;
            var password = req.body.password;
            // Create a temporary client context
            var clientContext = new ClientContext_1.ClientContext();
            clientContext.email = email;
            clientContext.roles = ["temporaryAccess"];
            var authenticationService = new Authentication_1.AuthenticationService(global.locator, clientContext);
            authenticationService.validatePassword(password).then(function (jwt) {
                res.send(jwt);
            }).catch(function (err) {
                logger.error(err);
                res.sendStatus(500);
            });
        });
        router.post("/auth/login/otp/generate", function (req, res) {
            var logger = global.locator.logger;
            var mobileNumber = req.body.mobileNumber;
            // Create a temporary client context
            var clientContext = new ClientContext_1.ClientContext();
            clientContext.mobileNumber = mobileNumber;
            clientContext.roles = ["temporaryAccess"];
            var authenticationService = new Authentication_1.AuthenticationService(global.locator, clientContext);
            authenticationService.generateOTP().then(function (result) {
                res.send(result);
            }).catch(function (err) {
                logger.error(err);
                res.sendStatus(500);
            });
        });
        router.post("/auth/login/otp/validate", function (req, res) {
            var logger = global.locator.logger;
            var mobileNumber = req.body.mobileNumber;
            var otp = req.body.otp;
            // Create a temporary client context
            var clientContext = new ClientContext_1.ClientContext();
            clientContext.mobileNumber = mobileNumber;
            clientContext.roles = ["temporaryAccess"];
            var authenticationService = new Authentication_1.AuthenticationService(global.locator, clientContext);
            authenticationService.validateOTP(otp).then(function (result) {
                res.send(result);
            }).catch(function (err) {
                logger.error(err);
                res.sendStatus(500);
            });
        });
        router.get("/auth/token", function (req, res) {
            var logger = global.locator.logger;
            var clientContext = req.clientContext;
            if (clientContext) {
                var authenticationService = new Authentication_1.AuthenticationService(global.locator, clientContext);
                authenticationService.getPermenentJWT().then(function (result) {
                    res.send(result);
                }).catch(function (err) {
                    logger.error(err);
                    res.sendStatus(500);
                });
            }
            else {
                logger.error("No clientContext in the request");
                res.sendStatus(401);
            }
        });
    };
    ;
    return AuthenticationEndpointSetup;
}());
exports.AuthenticationEndpointSetup = AuthenticationEndpointSetup;
