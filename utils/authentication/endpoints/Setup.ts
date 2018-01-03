import * as express from "express";
import { Promise } from "rsvp";

import { AuthenticationService } from "./../Authentication";
import { Locator } from "./../../../models/common/Locator";
import { ClientContext } from "./../../../models/common/ClientContext";
import { Member } from "./../../../models/member/Member";
import { deserialize } from "serializer.ts/Serializer";
import { PrincipalType } from "./../../../enums/common/PrincipalType";

export class AuthenticationEndpointSetup {

    static init(router: express.Router) {

        router.post("/auth/login", (req, res) => {

            let logger = (<any>global).locator.logger;
            let email = req.body.username;
            let password = req.body.password;

            // Create a temporary client context
            let clientContext = new ClientContext();
            clientContext.email = email;
            clientContext.roles = ["temporaryAccess"];

            let authenticationService = new AuthenticationService((<any>global).locator, clientContext);
            authenticationService.validatePassword(password).then((jwt) => {
                res.send(jwt);
            }).catch((err) => {
                logger.error(err);
                res.sendStatus(500);
            });
        });

        router.post("/auth/login/otp/generate", (req, res) => {
            let logger = (<any>global).locator.logger;
            let mobileNumber = req.body.mobileNumber;

            // Create a temporary client context
            let clientContext = new ClientContext();
            clientContext.mobileNumber = mobileNumber;
            clientContext.roles = ["temporaryAccess"];

            let authenticationService = new AuthenticationService((<any>global).locator, clientContext);
            authenticationService.generateOTP().then((result) => {
                res.send(result);
            }).catch((err) => {
                logger.error(err);
                res.sendStatus(500);
            });
        });

        router.post("/auth/login/otp/validate", (req, res) => {
            let logger = (<any>global).locator.logger;
            let mobileNumber = req.body.mobileNumber;
            let otp = req.body.otp;

            // Create a temporary client context
            let clientContext = new ClientContext();
            clientContext.mobileNumber = mobileNumber;
            clientContext.roles = ["temporaryAccess"];

            let authenticationService = new AuthenticationService((<any>global).locator, clientContext);
            authenticationService.validateOTP(otp).then((result) => {
                res.send(result);
            }).catch((err) => {
                logger.error(err);
                res.sendStatus(500);
            });
        });

        router.get("/auth/token", (req, res) => {
            let logger = (<any>global).locator.logger;

            let clientContext: ClientContext = (<any>req).clientContext;
            if (clientContext) {
                let authenticationService = new AuthenticationService((<any>global).locator, clientContext);
                authenticationService.getPermenentJWT().then((result) => {
                    res.send(result);
                }).catch((err) => {
                    logger.error(err);
                    res.sendStatus(500);
                });
            } else {
                logger.error("No clientContext in the request");
                res.sendStatus(401);
            }
        });
    };
}

